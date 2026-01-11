import { MeshWallet } from "@meshsdk/core";
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
        return;
        const meshTxBuilder: MeshTxBuilder = new MeshTxBuilder({
            meshWallet: meshWallet,
            threshold: 2,
            allowance: 10 * DECIMAL_PLACE,
        });

        const unsignedTx: string = await meshTxBuilder.mint({
            name: "Aiken Course 2023",
            quantity: "10000000",
            receiver: "addr_test1qz45qtdupp8g30lzzr684m8mc278s284cjvawna5ypwkvq7s8xszw9mgmwpxdyakl7dgpfmzywctzlsaghnqrl494wnqhgsy3g",
            owners: [
                "addr_test1qz45qtdupp8g30lzzr684m8mc278s284cjvawna5ypwkvq7s8xszw9mgmwpxdyakl7dgpfmzywctzlsaghnqrl494wnqhgsy3g",
                "addr_test1qr39uar0u87xrmptw0f8ryx5mp3scvc3pkehp57yj5zhugxdgese6p77sy9hk0rqc5wqd6n8vmfyqq9f7sdfz9dm0azqzmmdew",
                "addr_test1qqy0z4ekhv8gcnmvkeakkaher82rlrx2yu9y79cjf4r704pqg73fhf002takqewlvjcy39dellyumg43f08uea0p6mps7pw77f",
                "addr_test1qrpfhvwrmq0y27k2elu0seh65w6kwyxxee6sq7f9d2ax62e8wm6fj2y63rp3kql4skhu2wyt0uml07w2pggzpzh95ugqk9j5d9",
                "addr_test1qpm9a92nk6grxwsxluqyjt9xd3cjcps90fjv8txm4spd6tv4mkujqpc7fzlvqu40kyvzh6fxmqp0578uk564ffqtfr7s9ppr9y",
            ],
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
            threshold: 2,
            allowance: 10 * DECIMAL_PLACE,
        });

        const unsignedTx: string = await meshTxBuilder.burn({
           assetName: "",
           quantity: ""
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
        // return;

        const meshTxBuilder: MeshTxBuilder = new MeshTxBuilder({
            meshWallet: meshWallet,
            threshold: 2,
            allowance: 10 * DECIMAL_PLACE,
        });

        const unsignedTx: string = await meshTxBuilder.update({
            name: "Aiken Course 2023",
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
