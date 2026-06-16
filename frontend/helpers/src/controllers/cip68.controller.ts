import { Request, Response } from "express";
import { Cip68TxBuilder } from "../txbuilders/cip68.txbuilder";

import { MeshWallet } from "@meshsdk/core";
import { APP_NETWORK_ID } from "../constants/enviroments.constant";
import blockfrostProvider from "../providers/cardano/blockfrost";

class Cip68Controller {
    mint = async (request: Request, response: Response) => {
        try {
            const { metadata, assetName, quantity, address } = request.body;

            if (!metadata || typeof metadata !== "object") {
                return response
                    .status(400)
                    .json({ message: "Invalid metadata format. Expected an object." });
            }

            if (Number(quantity) <= 0) {
                return response.status(400).json({
                    message: "Invalid quantity. Quantity must be a negative number for burning.",
                });
            }

            if (!assetName || typeof assetName !== "string") {
                return response
                    .status(400)
                    .json({ message: "Invalid assetName. Expected a string." });
            }

            if (!address || typeof address !== "string") {
                return response
                    .status(400)
                    .json({ message: "Invalid address. Expected a string." });
            }

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

            const meshTxBuilder: Cip68TxBuilder = new Cip68TxBuilder({
                meshWallet: meshWallet,
            });
            await meshTxBuilder.initalize();

            const unsignedTx: string = await meshTxBuilder.mint({
                assetName: assetName,
                metadata: metadata,
                quantity: quantity,
            });
            return response.status(200).json({
                unsignedTx,
                message:
                    "Transaction built successfully. Please sign and submit the transaction to mint the asset.",
            });
        } catch (error) {
            return response.status(500).json({
                message: "An error occurred while processing the request.",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    };

    update = async (request: Request, response: Response) => {
        try {
            const { metadata, assetName, address } = request.body;

            if (!metadata || typeof metadata !== "object") {
                return response
                    .status(400)
                    .json({ message: "Invalid metadata format. Expected an object." });
            }

            if (!assetName || typeof assetName !== "string") {
                return response
                    .status(400)
                    .json({ message: "Invalid assetName. Expected a string." });
            }

            if (!address || typeof address !== "string") {
                return response
                    .status(400)
                    .json({ message: "Invalid address. Expected a string." });
            }

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

            const meshTxBuilder: Cip68TxBuilder = new Cip68TxBuilder({
                meshWallet: meshWallet,
            });
            await meshTxBuilder.initalize();

            const unsignedTx: string = await meshTxBuilder.update({
                assetName: assetName,
                metadata: metadata,
            });
            response.status(200).json({
                unsignedTx,
                message:
                    "Transaction built successfully. Please sign and submit the transaction to mint the asset.",
            });
        } catch (error) {
            response.status(500).json({
                message: "An error occurred while processing the request.",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    };

    burn = async (request: Request, response: Response) => {
        try {
            const { assetName, quantity, address } = request.body;

            if (Number(quantity) >= 0) {
                return response.status(400).json({
                    message: "Invalid quantity. Quantity must be a negative number for burning.",
                });
            }

            if (!assetName || typeof assetName !== "string") {
                return response
                    .status(400)
                    .json({ message: "Invalid assetName. Expected a string." });
            }

            if (!address || typeof address !== "string") {
                return response
                    .status(400)
                    .json({ message: "Invalid address. Expected a string." });
            }

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

            const meshTxBuilder: Cip68TxBuilder = new Cip68TxBuilder({
                meshWallet: meshWallet,
            });

            await meshTxBuilder.initalize();

            const unsignedTx: string = await meshTxBuilder.burn({
                assetName: assetName,
                quantity: quantity,
            });
            return response.status(200).json({
                unsignedTx,
                message:
                    "Transaction built successfully. Please sign and submit the transaction to mint the asset.",
            });
        } catch (error) {
            response.status(500).json({
                message: "An error occurred while processing the request.",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    };
}

export default new Cip68Controller();
