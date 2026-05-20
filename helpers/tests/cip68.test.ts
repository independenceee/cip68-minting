import { MeshWallet } from "@meshsdk/core";
import { Cip68TxBuilder } from "../src/txbuilders/cip68.txbuilder";
import { APP_MNEMONIC, APP_NETWORK, APP_NETWORK_ID } from "../src/constants/enviroments.constant";

import blockfrostProvider from "../src/providers/cardano/blockfrost";
import * as jest from "jest";

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
        const cip68TxBuilder: Cip68TxBuilder = new Cip68TxBuilder({
            meshWallet: meshWallet,
        });

        await cip68TxBuilder.initalize();

        const unsignedTx: string = await cip68TxBuilder.mint({
            assetName: "Aiken Course 2010",
            quantity: "1",
            metadata: {
                name: "Aiken Course 2010",
                description: "",
                image: "",
                mediaType: "",
            },
        });

        const signedTx = await meshWallet.signTx(unsignedTx, true);
        const txHash = await meshWallet.submitTx(signedTx);
        await new Promise<void>(function (resolve) {
            blockfrostProvider.onTxConfirmed(txHash, () => {
                console.log(`https://${APP_NETWORK}.cexplorer.io/tx/` + txHash);
                resolve();
            });
        });
    });

    test("Burn", async function () {
        return;

        const cip68TxBuilder: Cip68TxBuilder = new Cip68TxBuilder({
            meshWallet: meshWallet,
        });
        await cip68TxBuilder.initalize();

        const unsignedTx: string = await cip68TxBuilder.burn({
            assetName: "Aiken Course 2030",
            quantity: "-1",
        });

        const signedTx = await meshWallet.signTx(unsignedTx, true);
        const txHash = await meshWallet.submitTx(signedTx);
        await new Promise<void>(function (resolve) {
            blockfrostProvider.onTxConfirmed(txHash, () => {
                console.log(`https://${APP_NETWORK}.cexplorer.io/tx/` + txHash);
                resolve();
            });
        });
    });

    test("Update", async function () {
        return;

        const cip68TxBuilder: Cip68TxBuilder = new Cip68TxBuilder({
            meshWallet: meshWallet,
        });
        await cip68TxBuilder.initalize();

        const unsignedTx: string = await cip68TxBuilder.update({
            assetName: "Aiken Course 2024",
            metadata: {
                name: "Aiken Course 2024",
                image: "ipfs://image.png",
                description: "This is a simple example of CIP-68",
                mediaType: "image/png",
            },
        });

        const signedTx = await meshWallet.signTx(unsignedTx, true);
        const txHash = await meshWallet.submitTx(signedTx);
        await new Promise<void>(function (resolve) {
            blockfrostProvider.onTxConfirmed(txHash, () => {
                console.log(`https://${APP_NETWORK}.cexplorer.io/tx/` + txHash);
                resolve();
            });
        });
    });
});
