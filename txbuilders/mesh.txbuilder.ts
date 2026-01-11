import { getPkHash } from "@/libs/utils";
import { MeshAdapter } from "../adapters/mesh.adapter";
import { APP_NETWORK } from "../constants/enviroments.constant";
import { deserializeAddress, mConStr0, mConStr1, mConStr2, stringToHex, metadataToCip68, CIP68_222, CIP68_100 } from "@meshsdk/core";

export class MeshTxBuilder extends MeshAdapter {
      /**
   * @method Mint
   * @description Mint Asset (NFT/Token) with CIP68
   * @param assetName - string
   * @param metadata - Record<string, string>
   * @param quantity - string
   *
   * @returns unsignedTx
   */
    mint = async ({
        assetName,
        metadata,
        quantity,
        receiver,
    }: {
        assetName: string;
        metadata: Record<string, string>;
        quantity: string;
        receiver?: string;
    }): Promise<string> => {
        const { utxos, walletAddress, collateral } = await this.getWalletForTx();
        const utxo = await this.getAddressUTXOAsset(this.spendAddress, this.policyId + CIP68_100(stringToHex(assetName)));

       
        const unsignedTx = this.meshTxBuilder;

        if (utxo ) {
             const author = await getPkHash(utxo.output.plutusData as string)
             if(author !== deserializeAddress(walletAddress).pubKeyHash) {
                throw new Error(`${assetName} has been exist`);
             }

             unsignedTx.mintPlutusScriptV3()
             .mint(quantity, this.policyId, CIP68_222(stringToHex(assetName)))
             .mintingScript(this.mintScriptCbor)
             .mintRedeemerValue(mConStr0([]))

             .txOut(receiver ? receiver: walletAddress, [
                {unit: this.policyId + CIP68_222(stringToHex(assetName)) , quantity: quantity}
             ])
        } else {
            unsignedTx
            .mintPlutusScriptV3()
            .mint(quantity, this.policyId, CIP68_222(stringToHex(assetName)))
            .mintingScript(this.mintScriptCbor)
            .mintRedeemerValue(mConStr0([]))
            .txOut(receiver ? receiver : walletAddress, [
                {
                    unit: this.policyId + CIP68_222(stringToHex(assetName)),
                    quantity: quantity
                }
            ])

            .mintPlutusScriptV3()
            .mint("1", this.policyId, CIP68_100(stringToHex(assetName)))
            .mintingScript(this.mintScriptCbor)
            .mintRedeemerValue(mConStr0([]))
            .txOut(this.spendAddress, [
                {
                    unit: this.policyId + CIP68_100(stringToHex(assetName)),
                    quantity: "1"
                }
            ])
            .txOutInlineDatumValue(metadataToCip68(metadata))


        }
        unsignedTx
            .selectUtxosFrom(utxos)
            .changeAddress(walletAddress)
            .requiredSignerHash(deserializeAddress(walletAddress).pubKeyHash)
            .txInCollateral(collateral.input.txHash, collateral.input.outputIndex)
            .setNetwork(APP_NETWORK);

        return await unsignedTx.complete();
    };

    burn = async ({ assetName, quantity }: { assetName: string;quantity: string;  }): Promise<string> => {
        const { utxos, walletAddress, collateral } = await this.getWalletForTx();

        const unsignedTx = this.meshTxBuilder;
        const utxo = await this.getAddressUTXOAsset(this.spendAddress, this.policyId + stringToHex(assetName));
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

    update = async ({ assetName, metadata }: { assetName: string, metadata: Record<string, string> }): Promise<string> => {
        const { utxos, walletAddress, collateral } = await this.getWalletForTx();

        const unsignedTx = this.meshTxBuilder;

        const utxo = await this.getAddressUTXOAsset(this.spendAddress, this.policyId + stringToHex(assetName));

        if (!utxo) {
            throw new Error("No Reference Asset Exists");
        }

        const datum = this.convertDatum({ plutusData: utxo.output.plutusData as string });

        if (datum.signers.length >= this.threshold) {
            unsignedTx
                .mintPlutusScriptV3()
                .mint("-1", this.policyId, stringToHex(assetName))
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
