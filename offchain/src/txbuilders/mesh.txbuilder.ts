import { getPkHash } from "@/libs/utils";
import { MeshAdapter } from "../../adapters/mesh.adapter";
import { APP_NETWORK } from "../constants/enviroments";
import {
    deserializeAddress,
    mConStr0,
    mConStr1,
    stringToHex,
    metadataToCip68,
    CIP68_222,
    CIP68_100,
    hexToString,
    metadataObjToMap,
} from "@meshsdk/core";
import { koiosFetcher } from "@/src/providers/cardano";
import { AssetDetails, AssetType } from "@/src/types";
import { convertToKeyValue } from "@/lib/utils";

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

        if (utxo) {
            unsignedTx
                .mintPlutusScriptV3()
                .mint(quantity, this.policyId, CIP68_222(stringToHex(assetName)))
                .mintingScript(this.mintScriptCbor)
                .mintRedeemerValue(mConStr0([]))
                .txOut(receiver ? receiver : walletAddress, [{ unit: this.policyId + CIP68_222(stringToHex(assetName)), quantity: quantity }]);
        } else {
            unsignedTx
                .mintPlutusScriptV3()
                .mint(quantity, this.policyId, CIP68_222(stringToHex(assetName)))
                .mintingScript(this.mintScriptCbor)
                .mintRedeemerValue(mConStr0([]))
                .txOut(receiver ? receiver : walletAddress, [
                    {
                        unit: this.policyId + CIP68_222(stringToHex(assetName)),
                        quantity: quantity,
                    },
                ])
                .mintPlutusScriptV3()
                .mint("1", this.policyId, CIP68_100(stringToHex(assetName)))
                .mintingScript(this.mintScriptCbor)
                .mintRedeemerValue(mConStr0([]))
                .txOut(this.spendAddress, [
                    {
                        unit: this.policyId + CIP68_100(stringToHex(assetName)),
                        quantity: "1",
                    },
                ])
                .txOutInlineDatumValue(this.metadataToCip68(metadata));
        }
        unsignedTx
            .txOut(this.platformAddress, [
                {
                    unit: "lovelace",
                    quantity: String(this.platformFee),
                },
            ])
            .selectUtxosFrom(utxos)
            .changeAddress(walletAddress)
            .requiredSignerHash(deserializeAddress(walletAddress).pubKeyHash)
            .txInCollateral(collateral.input.txHash, collateral.input.outputIndex)
            .setNetwork(APP_NETWORK);
        return await unsignedTx.complete();
    };

    /**
     * @method Burn
     * @description Burn Asset (NFT/Token) with CIP68
     * @param assetName - string
     * @param quantity - string
     *
     * @returns unsignedTx
     */
    burn = async ({ assetName, quantity }: { assetName: string; quantity: string }): Promise<string> => {
        const { utxos, walletAddress, collateral } = await this.getWalletForTx();

        const unsignedTx = this.meshTxBuilder;
        const utxoRef = await this.getAddressUTXOAsset(this.spendAddress, this.policyId + CIP68_100(stringToHex(assetName)));

        console.log(utxoRef);

        if (!utxoRef) {
            throw new Error("Cannot find proposal from Treasury");
        }

        const utxoUser = await this.getAddressUTXOAssets(walletAddress, this.policyId + CIP68_222(stringToHex(assetName)));

        const amount = utxoUser.reduce((amount, utxos) => {
            return (
                amount +
                utxos.output.amount.reduce((amt, utxo) => {
                    if (utxo.unit === this.policyId + CIP68_222(stringToHex(assetName))) {
                        return amt + Number(utxo.quantity);
                    }
                    return amt;
                }, 0)
            );
        }, 0);

        if (-Number(quantity) === amount) {
            unsignedTx
                .mintPlutusScriptV3()
                .mint(quantity, this.policyId, CIP68_222(stringToHex(assetName)))
                .mintRedeemerValue(mConStr1([]))
                .mintingScript(this.mintScriptCbor)

                .mintPlutusScriptV3()
                .mint("-1", this.policyId, CIP68_100(stringToHex(assetName)))
                .mintRedeemerValue(mConStr1([]))
                .mintingScript(this.mintScriptCbor)

                .spendingPlutusScriptV3()
                .txIn(utxoRef.input.txHash, utxoRef.input.outputIndex)
                .txInInlineDatumPresent()
                .txInRedeemerValue(mConStr1([]))
                .txInScript(this.spendScriptCbor);
        } else {
            unsignedTx
                .mintPlutusScriptV3()
                .mint(quantity, this.policyId, CIP68_222(stringToHex(assetName)))
                .mintRedeemerValue(mConStr1([]))
                .mintingScript(this.mintScriptCbor)

                .txOut(walletAddress, [
                    {
                        unit: this.policyId + CIP68_222(stringToHex(assetName)),
                        quantity: String(amount + Number(quantity)),
                    },
                ]);
        }

        unsignedTx
            .txOut(this.platformAddress, [
                {
                    unit: "lovelace",
                    quantity: String(this.platformFee),
                },
            ])
            .selectUtxosFrom(utxos)
            .changeAddress(walletAddress)
            .requiredSignerHash(deserializeAddress(walletAddress).pubKeyHash)
            .txInCollateral(collateral.input.txHash, collateral.input.outputIndex)
            .setNetwork(APP_NETWORK);
        return await unsignedTx.complete();
    };

    /**
     * @method Update
     * @description Update Asset (NFT/Token) with CIP68
     * @param assetName - string
     * @param metadata - Record<string, string>
     * @param txHash - string
     * @returns
     */
    update = async ({ assetName, metadata }: { assetName: string; metadata: Record<string, string> }): Promise<string> => {
        const { utxos, walletAddress, collateral } = await this.getWalletForTx();

        const unsignedTx = this.meshTxBuilder;

        const utxoRef = await this.getAddressUTXOAsset(this.spendAddress, this.policyId + CIP68_100(stringToHex(assetName)));

        if (!utxoRef) {
            throw new Error("No Reference Asset Exists");
        }

        unsignedTx
            .spendingPlutusScriptV3()
            .txIn(utxoRef.input.txHash, utxoRef.input.outputIndex)
            .txInInlineDatumPresent()
            .txInRedeemerValue(mConStr0([]))
            .txInScript(this.spendScriptCbor)
            .txOut(this.spendAddress, [
                {
                    unit: this.policyId + CIP68_100(stringToHex(assetName)),
                    quantity: "1",
                },
            ])
            .txOutInlineDatumValue(this.metadataToCip68(metadata));

        unsignedTx
            .txOut(this.platformAddress, [
                {
                    unit: "lovelace",
                    quantity: String(this.platformFee),
                },
            ])
            .selectUtxosFrom(utxos)
            .changeAddress(walletAddress)
            .requiredSignerHash(deserializeAddress(walletAddress).pubKeyHash)
            .txInCollateral(collateral.input.txHash, collateral.input.outputIndex)
            .setNetwork(APP_NETWORK);
        return await unsignedTx.complete();
    };

    /**
     * @method assets
     * @description Get asset from smart contract
     * @param page - number
     * @param limit - number
     * @returns
     */
    assets = async ({ page, limit }: { page: number; limit: number }) => {
        const assets: AssetType[] = await koiosFetcher.fetchAssetsFromAddress(this.spendAddress);
        const filterAssets = assets.filter((asset) => asset.policy_id === this.policyId);
        const total = filterAssets.length;
        const assetsSlice: AssetType[] = filterAssets.slice((page - 1) * limit, page * limit);
        const asset_list = assetsSlice.map((asset) => {
            return [asset.policy_id, asset.asset_name];
        });
        const data = await koiosFetcher.fetchAssetsInfo(asset_list);
        const assetDetails: AssetDetails[] = data.map((asset: any) => {
            return {
                policy_id: asset.policy_id,
                asset_name: asset.asset_name,
                total_supply: asset.total_supply,
                onchain_metadata: convertToKeyValue(asset.cip68_metadata?.["100"]?.fields[0].map),
            };
        });
        return {
            total_item: total,
            data: assetDetails,
            current_page: page,
            total_asset: assets.length,
            total_page: Math.ceil(total / limit),
        };
    };
}
