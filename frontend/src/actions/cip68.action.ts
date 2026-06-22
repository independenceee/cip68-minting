"use server";

import { MeshWallet } from "@meshsdk/core";
import { MeshTxBuilder } from "@/txbuilders/mesh.txbuilder";
import { APP_NETWORK_ID } from "@/constants/enviroments";
import { blockfrostProvider } from "@/providers/cardano";

export async function mint({
    address,
    assetName,
    metadata,
    quantity,
}: {
    address: string;
    assetName: string;
    metadata: Record<string, string>;
    quantity: string;
}) {
    const meshWallet = new MeshWallet({
        accountIndex: 0,
        networkId: APP_NETWORK_ID,
        fetcher: blockfrostProvider,
        submitter: blockfrostProvider,
        key: {
            type: "address",
            address: address,
        },
    });

    const meshTxBuilder: MeshTxBuilder = new MeshTxBuilder({
        meshWallet: meshWallet,
    });
    await meshTxBuilder.initalize();

    return await meshTxBuilder.mint({
        assetName: assetName,
        quantity: quantity,
        metadata: metadata,
    });
}

export async function update({
    address,
    assetName,
    metadata,
}: {
    address: string;
    assetName: string;
    metadata: Record<string, string>;
}) {
    const meshWallet = new MeshWallet({
        accountIndex: 0,
        networkId: APP_NETWORK_ID,
        fetcher: blockfrostProvider,
        submitter: blockfrostProvider,
        key: {
            type: "address",
            address: address,
        },
    });

    const meshTxBuilder: MeshTxBuilder = new MeshTxBuilder({
        meshWallet: meshWallet,
    });
    await meshTxBuilder.initalize();

    return await meshTxBuilder.update({
        assetName: assetName,
        metadata: metadata,
    });
}

export async function burn({
    address,
    assetName,
    quantity,
}: {
    address: string;
    assetName: string;
    quantity: string;
}) {
    const meshWallet = new MeshWallet({
        accountIndex: 0,
        networkId: APP_NETWORK_ID,
        fetcher: blockfrostProvider,
        submitter: blockfrostProvider,
        key: {
            type: "address",
            address: address,
        },
    });

    const meshTxBuilder: MeshTxBuilder = new MeshTxBuilder({
        meshWallet: meshWallet,
    });
    await meshTxBuilder.initalize();

    return await meshTxBuilder.burn({
        assetName: assetName,
        quantity: quantity,
    });
}
