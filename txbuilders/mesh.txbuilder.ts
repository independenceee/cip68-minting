import { MeshAdapter } from "../adapters/mesh.adapter";
import { APP_NETWORK } from "../constants/enviroments.constant";
import { deserializeAddress, mTuple, mConStr0, mConStr1, mConStr2, stringToHex, list } from "@meshsdk/core";

export class MeshTxBuilder extends MeshAdapter {
    deposit = async ({
        quantity,
        receiver,
        name,
        owners,
    }: {
        name: string;
        quantity: string;
        receiver?: string;
        owners?: string[];
        signers?: string[];
    }): Promise<string> => {
        const { utxos, walletAddress, collateral } = await this.getWalletForTx();
        const utxo = await this.getAddressUTXOAsset(this.spendAddress, this.policyId + stringToHex(name));

        const unsignedTx = this.meshTxBuilder;

        if (utxo) {
            const datum = this.convertDatum({ plutusData: utxo.output.plutusData as string });

            unsignedTx
                .spendingPlutusScript("V3")
                .txIn(utxo.input.txHash, utxo.input.outputIndex)
                .txInInlineDatumPresent()
                .txInRedeemerValue(mConStr0([]))
                .txInScript(this.spendScriptCbor)

                .txOut(this.spendAddress, [
                    { unit: this.policyId + stringToHex(name), quantity: "1" },
                    {
                        unit: "lovelace",
                        quantity: String(
                            utxo.output.amount.reduce((total, asset) => {
                                if (asset.unit === "lovelace") {
                                    return total + Number(asset.quantity);
                                }
                                return total;
                            }, Number(quantity)),
                        ),
                    },
                ])
                .txOutInlineDatumValue(
                    mConStr0([
                        1,
                        // mConStr0([deserializeAddress(datum.receiver!).pubKeyHash, deserializeAddress(datum.receiver!).stakeCredentialHash]),
                        datum.owners!.map((owner) => mConStr0([deserializeAddress(owner).pubKeyHash, deserializeAddress(owner).stakeCredentialHash])),
                        datum.signers!.map((signer) =>
                            mConStr0([deserializeAddress(signer).pubKeyHash, deserializeAddress(signer).stakeCredentialHash]),
                        ),
                    ]),
                );
        } else {
            unsignedTx
                .mintPlutusScriptV3()
                .mint("1", this.policyId, stringToHex(name))
                .mintingScript(this.mintScriptCbor)
                .mintRedeemerValue(mConStr0([]))

                .txOut(this.spendAddress, [
                    {
                        unit: this.policyId + stringToHex(name),
                        quantity: "1",
                    },
                    {
                        unit: "lovelace",
                        quantity: quantity,
                    },
                ])
                .txOutInlineDatumValue(
                    mConStr0([
                        1,
                        // mConStr0([deserializeAddress(receiver!).pubKeyHash, deserializeAddress(receiver!).stakeCredentialHash]),
                        owners!.map((owner) => mConStr0([deserializeAddress(owner).pubKeyHash, deserializeAddress(owner).stakeCredentialHash])),
                        [],
                    ]),
                );
        }
        unsignedTx
            .selectUtxosFrom(utxos)
            .changeAddress(walletAddress)
            .requiredSignerHash(deserializeAddress(walletAddress).pubKeyHash)
            .txInCollateral(collateral.input.txHash, collateral.input.outputIndex)
            .setNetwork(APP_NETWORK);

        return await unsignedTx.complete();
    };

    signature = async ({ name }: { name: string }): Promise<string> => {
        const { utxos, walletAddress, collateral } = await this.getWalletForTx();

        const unsignedTx = this.meshTxBuilder;
        const utxo = await this.getAddressUTXOAsset(this.spendAddress, this.policyId + stringToHex(name));
        if (!utxo) {
            throw new Error("Cannot find proposal from Treasury");
        }

        const datum = this.convertDatum({ plutusData: utxo.output.plutusData as string });

        if (datum.owners.includes(walletAddress) && !datum.signers.includes(walletAddress)) {
            unsignedTx
                .spendingPlutusScriptV3()
                .txIn(utxo.input.txHash, utxo.input.outputIndex)
                .txInInlineDatumPresent()
                .txInRedeemerValue(mConStr2([]))
                .txInScript(this.spendScriptCbor)
                .txOut(this.spendAddress, utxo.output.amount)
                .txOutInlineDatumValue(
                    mConStr0([
                        1,
                        // mConStr0([deserializeAddress(datum.receiver!).pubKeyHash, deserializeAddress(datum.receiver!).stakeCredentialHash]),
                        datum.owners!.map((owner) => mConStr0([deserializeAddress(owner).pubKeyHash, deserializeAddress(owner).stakeCredentialHash])),
                        [
                            ...datum.signers!.map((signer) =>
                                mConStr0([deserializeAddress(signer).pubKeyHash, deserializeAddress(signer).stakeCredentialHash]),
                            ),
                            mConStr0([deserializeAddress(walletAddress).pubKeyHash, deserializeAddress(walletAddress).stakeCredentialHash]),
                        ],
                    ]),
                );
        } else {
            throw new Error("Wallet is signed");
        }

        unsignedTx
            .selectUtxosFrom(utxos)
            .changeAddress(walletAddress)
            .requiredSignerHash(deserializeAddress(walletAddress).pubKeyHash)
            .txInCollateral(collateral.input.txHash, collateral.input.outputIndex)
            .setNetwork(APP_NETWORK);
        return await unsignedTx.complete();
    };

    execute = async ({ name }: { name: string }): Promise<string> => {
        const { utxos, walletAddress, collateral } = await this.getWalletForTx();

        const unsignedTx = this.meshTxBuilder;

        const utxo = await this.getAddressUTXOAsset(this.spendAddress, this.policyId + stringToHex(name));

        if (!utxo) {
            throw new Error("Cannot find proposal from Treasury");
        }

        const datum = this.convertDatum({ plutusData: utxo.output.plutusData as string });

        if (datum.signers.length >= this.threshold) {
            unsignedTx
                .mintPlutusScriptV3()
                .mint("-1", this.policyId, stringToHex(name))
                .mintRedeemerValue(mConStr1([]))
                .mintingScript(this.mintScriptCbor)

                .spendingPlutusScriptV3()
                .txIn(utxo.input.txHash, utxo.input.outputIndex)
                .txInInlineDatumPresent()
                .txInRedeemerValue(mConStr1([]))
                .txInScript(this.spendScriptCbor)

                .txOut(datum.receiver, [
                    {
                        unit: "lovelace",
                        quantity: String(
                            utxo.output.amount.reduce((total, asset) => {
                                if (asset.unit === "lovelace") {
                                    return total + Number(asset.quantity);
                                }
                                return total;
                            }, Number(0)),
                        ),
                    },
                ]);
        } else {
            throw new Error("Cannot execute !");
        }
        unsignedTx
            .selectUtxosFrom(utxos)
            .changeAddress(walletAddress)
            .requiredSignerHash(deserializeAddress(walletAddress).pubKeyHash)
            .txInCollateral(collateral.input.txHash, collateral.input.outputIndex)
            .setNetwork(APP_NETWORK);
        return await unsignedTx.complete();
    };
}
