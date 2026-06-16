import {
    applyParamsToScript,
    deserializeAddress,
    IEvaluator,
    IFetcher,
    MeshTxBuilder,
    MeshWallet,
    mPubKeyAddress,
    PlutusScript,
    resolveScriptHash,
    scriptAddress,
    serializeAddressObj,
    serializePlutusScript,
    UTxO,
    Data,
    mConStr0,
} from "@meshsdk/core";
import plutus from "../../contract/plutus.json";
import { Plutus } from "../types";
import { DECIMAL_PLACE, title } from "../constants/common.constant";
import { APP_NETWORK_ID, APP_WALLET_ADDRESS } from "../constants/enviroments.constant";
import blockfrostProvider from "../providers/cardano/blockfrost";

/**
 * @description
 * MeshAdapter class provides a wrapper around Mesh SDK for:
 * - Managing Plutus scripts (mint & spend)
 * - Resolving policy IDs and script addresses
 * - Handling wallet UTxOs and collaterals
 * - Preparing data for transaction building
 */
export class Cip68Adapter {
    public policyId!: string;
    public platformFee: number;
    public spendAddress!: string;
    public issuerAddress!: string;
    public platformAddress: string;

    protected mintCompileCode!: string;
    protected mintScriptCbor!: string;
    protected mintScript!: PlutusScript;

    protected spendCompileCode!: string;
    protected spendScriptCbor!: string;
    protected spendScript!: PlutusScript;

    protected fetcher: IFetcher;
    protected elvaluator: IEvaluator;
    protected meshWallet: MeshWallet;
    protected meshTxBuilder!: MeshTxBuilder;

    /**
     * @description
     * Construct a MeshAdapter instance.
     * This sets up:
     * - Plutus scripts (mint & spend)
     * - Script addresses
     * - Policy ID resolution
     *
     * @param {MeshWallet} meshWallet - Active Mesh wallet instance to connect.
     */
    constructor({
        meshWallet = null!,
        platformAddress,
        platformFee,
    }: {
        meshWallet: MeshWallet;
        platformAddress?: string;
        platformFee?: number;
    }) {
        this.meshWallet = meshWallet;
        this.platformAddress = platformAddress ? platformAddress : APP_WALLET_ADDRESS;
        this.platformFee = platformFee ? platformFee : DECIMAL_PLACE;
        this.fetcher = blockfrostProvider;
        this.elvaluator = blockfrostProvider;
    }

    /**
     * Initialize all required data for the smart contract interaction.
     *
     * This function performs the following steps:
     * 1. Retrieves the issuer (wallet) address from the connected Mesh wallet.
     * 2. Reads and compiles the `spend` validator from the compiled Plutus scripts.
     * 3. Applies required parameters to the spend script:
     *    - Platform fee
     *    - Issuer credential (pubKeyHash and stakeCredentialHash)
     *    - Platform credential (pubKeyHash and stakeCredentialHash)
     * 4. Creates the final spend script object and derives the corresponding script address.
     * 5. Reads and compiles the `mint` validator.
     * 6. Applies parameters to the mint script including:
     *    - Platform fee
     *    - Issuer public key hash
     *    - Platform public key hash
     *    - Spend script hash
     *    - Platform stake credential hash
     * 7. Constructs the minting policy script and calculates the policyId.
     *
     * After initialization, the following properties will be available:
     * - issuerAddress
     * - spendScript
     * - spendAddress
     * - mintScript
     * - policyId
     *
     * This method must be executed before performing any transaction
     * such as minting, locking funds, or spending UTXOs.
     */
    public initalize = async () => {
        this.meshTxBuilder = new MeshTxBuilder({
            fetcher: this.fetcher,
            evaluator: this.elvaluator,
        });
        this.issuerAddress = this.meshWallet.getChangeAddress();
        this.spendCompileCode = this.readValidator(plutus as Plutus, title.spend);
        this.spendScriptCbor = applyParamsToScript(this.spendCompileCode, [
            this.platformFee,
            mPubKeyAddress(
                deserializeAddress(this.issuerAddress).pubKeyHash,
                deserializeAddress(this.issuerAddress).stakeCredentialHash,
            ),
            mPubKeyAddress(
                deserializeAddress(this.platformAddress).pubKeyHash,
                deserializeAddress(this.platformAddress).stakeCredentialHash,
            ),
        ]);
        this.spendScript = {
            code: this.spendScriptCbor,
            version: "V3",
        };
        this.spendAddress = serializeAddressObj(
            scriptAddress(
                deserializeAddress(
                    serializePlutusScript(this.spendScript, undefined, APP_NETWORK_ID, false)
                        .address,
                ).scriptHash,
                deserializeAddress(this.platformAddress).stakeCredentialHash,
                false,
            ),
            APP_NETWORK_ID,
        );

        this.mintCompileCode = this.readValidator(plutus as Plutus, title.mint);
        this.mintScriptCbor = applyParamsToScript(this.mintCompileCode, [
            this.platformFee,
            mPubKeyAddress(
                deserializeAddress(this.issuerAddress).pubKeyHash,
                deserializeAddress(this.issuerAddress).stakeCredentialHash,
            ),
            mPubKeyAddress(
                deserializeAddress(this.platformAddress).pubKeyHash,
                deserializeAddress(this.platformAddress).stakeCredentialHash,
            ),
            mPubKeyAddress(
                deserializeAddress(this.spendAddress).scriptHash,
                deserializeAddress(this.spendAddress).stakeCredentialHash,
            ),
        ]);
        this.mintScript = {
            code: this.mintScriptCbor,
            version: "V3",
        };
        this.policyId = resolveScriptHash(this.mintScriptCbor, "V3");
    };

    /**
     * @description
     * Retrieve wallet essentials for building a transaction:
     * - Available UTxOs
     * - A valid collateral UTxO (>= 5 ADA in lovelace)
     * - Wallet's change address
     *
     * Flow:
     * 1. Get all wallet UTxOs.
     * 2. Ensure collateral exists (create one if missing).
     * 3. Get wallet change address.
     *
     * @returns {Promise<{ utxos: UTxO[]; collateral: UTxO; walletAddress: string }>}
     *          Object containing wallet UTxOs, a collateral UTxO, and change address.
     *
     * @throws {Error}
     *         If UTxOs or wallet address cannot be retrieved.
     */
    protected getWalletForTx = async (): Promise<{
        utxos: UTxO[];
        collateral: UTxO;
        walletAddress: string;
    }> => {
        const utxos = await this.meshWallet.getUtxos();
        const collaterals =
            (await this.meshWallet.getCollateral()).length === 0
                ? [await this.getCollateral()]
                : await this.meshWallet.getCollateral();
        const walletAddress = await this.meshWallet.getChangeAddress();
        if (!utxos || utxos.length === 0)
            throw new Error("No UTXOs found in getWalletForTx method.");

        if (!collaterals || collaterals.length === 0) this.meshWallet.createCollateral();

        if (!walletAddress) throw new Error("No wallet address found in getWalletForTx method.");

        return { utxos, collateral: collaterals[0], walletAddress };
    };

    /**
     * @description
     * Read a specific Plutus validator from a compiled Plutus JSON object.
     *
     * @param {Plutus} plutus - The Plutus JSON file (compiled).
     * @param {string} title - The validator title to search for.
     *
     * @returns {string}
     *          Compiled Plutus script code as a hex string.
     *
     * @throws {Error}
     *         If validator with given title is not found.
     *
     */
    protected readValidator = function (plutus: Plutus, title: string): string {
        const validator = plutus.validators.find(function (validator) {
            return validator.title === title;
        });

        if (!validator) {
            throw new Error(`${title} validator not found.`);
        }

        return validator.compiledCode;
    };

    /**
     * @description
     * Fetch the last UTxO at a given address containing a specific asset.
     *
     * @param {string} address - Address to query.
     * @param {string} unit - Asset unit (policyId + hex-encoded name or "lovelace").
     *
     * @returns {Promise<UTxO>}
     *          The last matching UTxO for the specified asset.
     */
    protected getAddressUTXOAsset = async (address: string, unit: string): Promise<UTxO> => {
        const utxos = await this.fetcher.fetchAddressUTxOs(address, unit);
        return utxos[utxos.length - 1];
    };

    /**
     * @description
     * Fetch all UTxOs at a given address containing a specific asset.
     *
     * @param {string} address - Address to query.
     * @param {string} unit - Asset unit (policyId + hex-encoded name or "lovelace").
     *
     * @returns {Promise<UTxO[]>}
     *          List of UTxOs with the specified asset.
     */
    protected getAddressUTXOAssets = async (address: string, unit: string): Promise<UTxO[]> => {
        return await this.fetcher.fetchAddressUTxOs(address, unit);
    };

    /**
     * @description
     * Select a UTxO from wallet to serve as collateral for Plutus script transactions.
     *
     * Rules:
     * - Must contain only Lovelace.
     * - Must have quantity >= 5 ADA (5,000,000 lovelace).
     *
     * @returns {Promise<UTxO>}
     *          A UTxO that can be used as collateral.
     */
    protected getCollateral = async (): Promise<UTxO> => {
        const utxos = await this.meshWallet.getUtxos();
        return utxos.filter((utxo) => {
            const amount = utxo.output.amount;
            return (
                Array.isArray(amount) &&
                amount.length === 1 &&
                amount[0].unit === "lovelace" &&
                typeof amount[0].quantity === "string" &&
                Number(amount[0].quantity) >= 5_000_000
            );
        })[0];
    };

    /**
     * @description 
     * 
     * @param metadata 
     * @returns 
     */
    protected metadataToCip68 = (metadata: Record<string, string>): Data => {
        const map = new Map<string, string>();
        Object.entries(metadata).forEach(([key, value]) => {
            map.set(key, value ?? "");
        });

        return mConStr0([map, 1]);
    };
}
