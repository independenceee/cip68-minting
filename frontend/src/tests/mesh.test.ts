import { MeshWallet } from "@meshsdk/core";
import { MeshTxBuilder } from "@/txbuilders/mesh.txbuilder";
import { APP_MNEMONIC, APP_NETWORK_ID } from "@/constants/enviroments";

import { blockfrostProvider } from "@/providers/cardano";

describe("Open source dynamic assets (Token/NFT) generator (CIP68).", function () {
    let meshWallet: MeshWallet;

    beforeEach(async function () {
        meshWallet = new MeshWallet({
            accountIndex: 0,
            networkId: APP_NETWORK_ID,
            fetcher: blockfrostProvider,
            submitter: blockfrostProvider,
            key: {
                type: "mnemonic",
                words: APP_MNEMONIC?.split(" ") || [],
            },
        });
    });

    jest.setTimeout(600000000);

    test("Mint", async function () {
        // return;
        const meshTxBuilder: MeshTxBuilder = new MeshTxBuilder({
            meshWallet: meshWallet,
        });

        await meshTxBuilder.initalize();

        const unsignedTx: string = await meshTxBuilder.mint({
            assetName: "Aiken Course 2030",
            quantity: "1",
            metadata: {
                name: "Aiken Pioneer Token #001",
                image: "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
                mediaType: "image/png",
                description: "Chung chi hoan thanh khoa hoc Aiken Developer 2026",
                project: "Aiken Course 2026",
                releaseDate: "2026-05-22",
                author: "Blaze/Lucid Developer",
            },
        });

        const signedTx = await meshWallet.signTx(unsignedTx, true);
        const txHash = await meshWallet.submitTx(signedTx);
        await new Promise<void>(function (resolve) {
            blockfrostProvider.onTxConfirmed(txHash, () => {
                console.log("https://preprod.cexplorer.io/tx/" + txHash);
                resolve();
            });
        });
    }, 600000000);

    test("Burn", async function () {
        return;

        const meshTxBuilder: MeshTxBuilder = new MeshTxBuilder({
            meshWallet: meshWallet,
        });
        await meshTxBuilder.initalize();

        const unsignedTx: string = await meshTxBuilder.burn({
            assetName: "Aiken Course 2030",
            quantity: "-1",
        });

        const signedTx = await meshWallet.signTx(unsignedTx, true);
        const txHash = await meshWallet.submitTx(signedTx);
        await new Promise<void>(function (resolve) {
            blockfrostProvider.onTxConfirmed(txHash, () => {
                console.log("https://preprod.cexplorer.io/tx/" + txHash);
                resolve();
            });
        });
    });

    test("Update", async function () {
        // return;

        const meshTxBuilder: MeshTxBuilder = new MeshTxBuilder({
            meshWallet: meshWallet,
        });
        await meshTxBuilder.initalize();

        const unsignedTx: string = await meshTxBuilder.update({
            assetName: "Aiken Course 2030",
            metadata: {
                name: "Aiken Pioneer Token #001",
                image: "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
                mediaType: "image/png",
                description: "Chung chi hoan thanh khoa hoc Aiken Developer 2026",
                project: "Aiken Course 2030",
                releaseDate: "2026-05-23",
                author: "Blaze/Lucid Developer",
            },
        });

        const signedTx = await meshWallet.signTx(unsignedTx, true);
        const txHash = await meshWallet.submitTx(signedTx);
        await new Promise<void>(function (resolve) {
            blockfrostProvider.onTxConfirmed(txHash, () => {
                console.log("https://preprod.cexplorer.io/tx/" + txHash);
                resolve();
            });
        });
    }, 600000000);

    test("Assets", async function () {
        return;
        const meshTxBuilder: MeshTxBuilder = new MeshTxBuilder({
            meshWallet: meshWallet,
        });
        await meshTxBuilder.initalize();
        const assets = await meshTxBuilder.assets({ page: 1, limit: 6 });
        console.dir(assets);
    });
});
