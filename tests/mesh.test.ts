import { deserializeAddress, MeshWallet } from "@meshsdk/core";
import { MeshTxBuilder } from "../txbuilders/mesh.txbuilder";
import { blockfrostProvider } from "../providers/blockfrost.provider";
import { APP_MNEMONIC, APP_NETWORK_ID } from "../constants/enviroments.constant";
import { DECIMAL_PLACE } from "../constants/common.constant";

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

        const unsignedTx: string = await meshTxBuilder.mint({
            assetName: "Aiken Course 2024",
            quantity: "1",
            metadata: {
                name: "Aiken Course 2025",
                image: "ipfs://image.png",
                description: "This is a simple example of CIP-68",
                mediaType: "image/png",
                author: deserializeAddress(meshWallet.getChangeAddress()).pubKeyHash,
            },
        });

        const signedTx = await meshWallet.signTx(unsignedTx, true);
        const txHash = await meshWallet.submitTx(signedTx);
        await new Promise<void>(function (resolve) {
            blockfrostProvider.onTxConfirmed(txHash, () => {
                console.log("https://preview.cexplorer.io/tx/" + txHash);
                resolve();
            });
        });
    });

    test("Burn", async function () {
        return;

        const meshTxBuilder: MeshTxBuilder = new MeshTxBuilder({
            meshWallet: meshWallet,
        });

        const unsignedTx: string = await meshTxBuilder.burn({
            assetName: "Aiken Course 2024",
            quantity: "-1",
        });

        const signedTx = await meshWallet.signTx(unsignedTx, true);
        const txHash = await meshWallet.submitTx(signedTx);
        await new Promise<void>(function (resolve) {
            blockfrostProvider.onTxConfirmed(txHash, () => {
                console.log("https://preview.cexplorer.io/tx/" + txHash);
                resolve();
            });
        });
    });

    test("Update", async function () {
        return;

        const meshTxBuilder: MeshTxBuilder = new MeshTxBuilder({
            meshWallet: meshWallet,
        });

        const unsignedTx: string = await meshTxBuilder.update({
            assetName: "Aiken Course 2024",
            metadata: {
                name: "Aiken Course 2024",
                image: "ipfs://image.png",
                description: "This is a simple example of CIP-68",
                mediaType: "image/png",
                author: deserializeAddress(meshWallet.getChangeAddress()).pubKeyHash,
            },
        });

        const signedTx = await meshWallet.signTx(unsignedTx, true);
        const txHash = await meshWallet.submitTx(signedTx);
        await new Promise<void>(function (resolve) {
            blockfrostProvider.onTxConfirmed(txHash, () => {
                console.log("https://preview.cexplorer.io/tx/" + txHash);
                resolve();
            });
        });
    });
});
