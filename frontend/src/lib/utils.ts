import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import cbor from "cbor";
import { deserializeDatum } from "@meshsdk/core";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function shortenString(str = "", length: number = 6): string {
    if (str.length <= length * 2) {
        return str;
    }
    const start = str.slice(0, length);
    const end = str.slice(-length);
    return `${start}...${end}`;
}

export async function datumToJson(
    datum: string,
    option?: {
        contain_pk?: boolean;
    },
): Promise<unknown> {
    const cborDatum: Buffer = Buffer.from(datum, "hex");
    const datumMap = (await cbor.decodeFirst(cborDatum)).value[0];
    if (!(datumMap instanceof Map)) {
        throw new Error("Invalid Datum");
    }
    const obj: Record<string, string> = {};
    datumMap.forEach((value, key) => {
        const keyStr = key.toString("utf-8");
        if (keyStr === "_pk" && !option?.contain_pk) {
            return;
        }
        obj[keyStr] = keyStr !== "_pk" ? value.toString("utf-8") : value.toString("hex");
    });
    return obj;
}

/**
 * @description Extract the payment key hash (`_pk`) from inline datum.
 *
 * @param datum - The inline datum in hex string format.
 * @returns The payment key hash in hex format, or an empty string if not found.
 */
export async function getPaymentKeykHash(datum: string): Promise<string> {
    const cborDatum: Buffer = Buffer.from(datum, "hex");
    const decoded = await cbor.decodeFirst(cborDatum);
    for (const [key, value] of decoded.value[0]) {
        if (key.toString("utf-8") === "_pk") {
            return value.toString("hex");
        }
    }

    return "";
}

/**
 * @description Convert an array of key-value pairs (with hex-encoded bytes) into a plain JavaScript object.
 *
 * - Keys are decoded from hex to UTF-8 strings.
 * - Values are decoded from hex to UTF-8, except `_pk` which is left in hex.
 *
 * @example
 * convertToKeyValue([{ k: { bytes: "6162" }, v: { bytes: "6364" } }])
 * // { ab: "cd" }
 *
 * @param data - Array of objects containing `{ k: { bytes }, v: { bytes } }`.
 * @returns A record mapping decoded keys to decoded values.
 */
export function convertToKeyValue(data: { k: { bytes: string }; v: { bytes: string } }[]): Record<string, string> {
    return Object.fromEntries(
        data.map(({ k, v }) => {
            const key = Buffer.from(k.bytes, "hex").toString("utf-8");
            const value = key === "_pk" ? v.bytes : Buffer.from(v.bytes, "hex").toString("utf-8");
            return [key, value];
        }),
    );
}

export function convertDatum(plutusData: string): Record<string, string> {
    const datum = deserializeDatum(plutusData);
    const metadata: Record<string, string> = {};
    try {
        const list = datum?.fields?.[0]?.list || datum?.fields?.[0];

        if (!Array.isArray(list)) {
            console.warn("Invalid CIP68 format: list not found");
            return metadata;
        }

        list.forEach((item: any) => {
            const fields = item?.fields || item;

            if (!Array.isArray(fields) || fields.length < 2) return;

            const keyHex = fields[0]?.bytes;
            const valueHex = fields[1]?.bytes;

            if (!keyHex || !valueHex) return;

            const key = Buffer.from(keyHex, "hex").toString("utf8");
            const value = Buffer.from(valueHex, "hex").toString("utf8");

            metadata[key] = value;
        });

        return metadata;
    } catch (error) {
        console.error("Error converting CIP68 to metadata:", error);
        return {};
    }
}

/**
 * @description Convert inline datum from utxo to metadata
 * 1. Converts a hex string into a buffer for decoding.
 * 2. Decodes CBOR data from the buffer to a JavaScript object.
 * 3. Outputs a JSON metadata ready for further use
 *
 * @param datum
 * @returns metadata
 */
export async function deserializeInlineDatum(datum: string): Promise<unknown> {
    const cborDatum: Buffer = Buffer.from(datum, "hex");
    const datumMap = (await cbor.decodeFirst(cborDatum)).value[0];
    if (!(datumMap instanceof Map)) {
        throw new Error("Invalid Datum");
    }
    const obj: Record<string, string> = {};
    datumMap.forEach((value, key) => {
        const keyStr = key.toString("utf-8");
        obj[keyStr] = value.toString("utf-8");
    });
    return obj;
}
