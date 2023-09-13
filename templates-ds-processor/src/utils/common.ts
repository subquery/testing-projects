
export function getCollectionId(networkId: string, address: string): string {
    return `${networkId}-${address}`.toLowerCase();
}

export function getNftId(collectionId: string, tokenId: string): string {
    return `${collectionId}-${tokenId}`.toLowerCase();
}

export function getTransferId(
    networkId: string,
    transactionHash: string,
    logIndex: string,
    batchIndex: number
): string {
    return `${transactionHash}-${logIndex}-${batchIndex}-${networkId}`;
}

export function incrementBigInt(value: bigint): bigint {
    return BigInt(1) + value;
}
