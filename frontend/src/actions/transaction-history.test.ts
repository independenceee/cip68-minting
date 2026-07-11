import { buildTransactionHistory } from "./transaction-history";

describe("buildTransactionHistory", () => {
    it("tracks before/after metadata across sequential transactions", () => {
        const history = buildTransactionHistory([
            {
                txHash: "tx-1",
                datetime: 100,
                status: "Completed",
                action: "Mint",
                metadata: { name: "A", version: 1 },
                fee: "1000000",
            },
            {
                txHash: "tx-2",
                datetime: 200,
                status: "Completed",
                action: "Update",
                metadata: { name: "A", version: 2 },
                fee: "1000000",
            },
            {
                txHash: "tx-3",
                datetime: 300,
                status: "Completed",
                action: "Burn",
                metadata: { name: "A", version: 2 },
                fee: "1000000",
            },
        ]);

        expect(history[0].beforeMetadata).toEqual({});
        expect(history[0].afterMetadata).toEqual({ name: "A", version: 1 });
        expect(history[1].beforeMetadata).toEqual({ name: "A", version: 1 });
        expect(history[1].afterMetadata).toEqual({ name: "A", version: 2 });
        expect(history[2].beforeMetadata).toEqual({ name: "A", version: 2 });
        expect(history[2].afterMetadata).toEqual({});
    });
});
