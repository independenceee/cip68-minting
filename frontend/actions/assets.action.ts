"use server";

import { APP_NETWORK_ID, APP_WALLET_ADDRESS } from "@/frontend/constants/enviroments";
import { blockfrostFetcher, blockfrostProvider } from "@/providers/cardano";
import { MeshTxBuilder } from "@/txbuilders/mesh.txbuilder";
import { MeshWallet, stringToHex } from "@meshsdk/core";
import { isNil } from "lodash";

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
