"use server";

import { APP_NETWORK_ID } from "@/constants/enviroments";
import { blockfrostProvider } from "@/providers/cardano";
import { MeshTxBuilder } from "@/txbuilders/mesh.txbuilder";
import { MeshWallet } from "@meshsdk/core";
import { isNil } from "lodash";
import { convertDatum } from "@/lib/utils";
import { BlockFrostAPI } from "@blockfrost/blockfrost-js";
import { buildTransactionHistory } from "./transaction-history";

export async function getAssets({ page = 1, limit = 6, walletAddress }: { page?: number; limit?: number; walletAddress: string }) {
    try {
        if (isNil(walletAddress)) {
            throw new Error("walletAddress has been required.");
        }
        const meshWallet = new MeshWallet({
            networkId: APP_NETWORK_ID,
            fetcher: blockfrostProvider,
            submitter: blockfrostProvider,
            key: {
                type: "address",
                address: walletAddress,
            },
        });
        const meshTxBuilder = new MeshTxBuilder({
            meshWallet: meshWallet,
        });
        await meshTxBuilder.initalize();

        return meshTxBuilder.assets({ page, limit });
    } catch (error) {
        throw Error(String(error));
    }
}

export async function getAsset({ walletAddress, policyId, assetName }: { walletAddress: string; policyId: string; assetName: string }) {
    try {
        if (isNil(walletAddress)) {
            throw new Error("walletAddress has been required.");
        }
        const meshWallet = new MeshWallet({
            networkId: APP_NETWORK_ID,
            fetcher: blockfrostProvider,
            submitter: blockfrostProvider,
            key: {
                type: "address",
                address: walletAddress,
            },
        });
        const meshTxBuilder = new MeshTxBuilder({
            meshWallet: meshWallet,
        });
        await meshTxBuilder.initalize();

        return meshTxBuilder.asset({ policyId, assetName });
    } catch (error) {
        throw Error(String(error));
    }
}

interface HistoryEntry {
    txHash: string;
    datetime: number;
    status: "Completed";
    action: "Mint" | "Burn" | "Update" | "Unknown";
    metadata: Record<string, any>;
    fee: string;
    beforeMetadata?: Record<string, any>;
    afterMetadata?: Record<string, any>;
}

export const getTransactions = async ({ unit }: { unit: string }) => {
    const blockfrostApi = new BlockFrostAPI({
        projectId: process.env.BLOCKFROST_API_KEY || "",
    });

    const assetTxRefs = await blockfrostApi.assetsTransactions(unit);

    const histories: HistoryEntry[] = [];

    for (const { tx_hash } of assetTxRefs) {
        try {
            const txInfo = await blockfrostApi.txs(tx_hash);
            const utxos = await blockfrostApi.txsUtxos(tx_hash);

            let inputQty = 0;
            let outputQty = 0;

            const inputWithAsset = utxos.inputs.find((input) => input.amount.some((a) => a.unit === unit));
            if (inputWithAsset) {
                const amt = inputWithAsset.amount.find((a) => a.unit === unit);
                inputQty = Number(amt?.quantity || 0);
            }

            const outputWithAsset = utxos.outputs.find((output) => output.amount.some((a) => a.unit === unit));
            if (outputWithAsset) {
                const amt = outputWithAsset.amount.find((a) => a.unit === unit);
                outputQty = Number(amt?.quantity || 0);
            }

            let action: HistoryEntry["action"] = "Unknown";
            let quantityChange: number | undefined;
            if (inputQty === 0 && outputQty > 0) {
                action = "Mint";
                quantityChange = outputQty;
            } else if (outputQty === 0 && inputQty > 0) {
                action = "Burn";
                quantityChange = -inputQty;
            } else if (inputQty > 0 && outputQty > 0) {
                quantityChange = outputQty - inputQty;
                if (quantityChange === 0) {
                    action = "Update";
                } else {
                    action = "Update";
                }
            }

            let rawDatum: string | undefined;
            if (outputWithAsset?.inline_datum) {
                rawDatum = outputWithAsset.inline_datum;
            } else if (inputWithAsset?.inline_datum) {
                rawDatum = inputWithAsset.inline_datum;
            }

            let metadata: any = {};
            if (rawDatum) {
                try {
                    metadata = convertDatum(rawDatum);
                } catch (err) {
                    console.error(`Deserialize datum failed for tx ${tx_hash}:`, err);
                }
            }

            histories.push({
                txHash: tx_hash,
                datetime: txInfo.block_time,
                fee: txInfo.fees,
                status: "Completed",
                action,
                metadata,
            });
        } catch (err) {
            console.error(`Error processing tx ${tx_hash}:`, err);
        }
    }
    const historyWithState = buildTransactionHistory(histories);

    const latestMetadata = historyWithState[historyWithState.length - 1]?.afterMetadata || {};

    if (!historyWithState.length) {
        return {
            metadata: {},
            transaction_history: [],
            message: "Không có lịch sử giao dịch nào.",
        };
    }

    return {
        metadata: latestMetadata,
        transaction_history: historyWithState,
    };
};
