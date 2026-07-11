export type TransactionHistoryAction = "Mint" | "Burn" | "Update" | "Unknown";

export interface TransactionHistoryEntry {
    txHash: string;
    datetime: number;
    status: "Completed";
    action: TransactionHistoryAction;
    metadata: Record<string, any>;
    fee: string;
    beforeMetadata?: Record<string, any>;
    afterMetadata?: Record<string, any>;
}

export function buildTransactionHistory(histories: TransactionHistoryEntry[]) {
    const orderedHistories = [...histories].sort((a, b) => a.datetime - b.datetime);

    let previousMetadata: Record<string, any> = {};

    return orderedHistories.map((entry) => {
        const beforeMetadata = entry.action === "Mint" ? {} : previousMetadata;
        let afterMetadata: Record<string, any> = entry.metadata || {};

        if (entry.action === "Burn") {
            afterMetadata = {};
        } else if (entry.action === "Unknown") {
            afterMetadata = previousMetadata;
        }

        previousMetadata = entry.action === "Burn" ? {} : entry.metadata || {};

        return {
            ...entry,
            beforeMetadata,
            afterMetadata,
        };
    });
}
