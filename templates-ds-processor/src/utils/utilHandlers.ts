import {
  Collection,
  createERC721Datasource,
  Network,
  Metadata,
  StatusType
} from '../types';
import {
  getCollectionId,
} from './common';
import { Erc721__factory } from '../types/contracts';
import {FrontierEthProvider} from "@subql/frontier-evm-processor";

export async function handleNetwork(id: string): Promise<void> {
  let network = await Network.get(id);
  if (!network) {
    network = Network.create({
      id,
    });
    await network.save();
  }
}
export async function handleMetadata(id: string): Promise<void> {
  let metdata = await Metadata.get(id);

  if (!metdata) {
    metdata = Metadata.create({
      id,
      metadata_status: StatusType.PENDING,
    });
    await metdata.save();
  }
}

export async function handleDsCreation(
    address: string,
    blockNumber: bigint,
    timestamp: bigint,
    creatorAddress: string,
): Promise<void> {
  let isErc721 = false;
  const provider = new FrontierEthProvider()
  const erc721Instance = Erc721__factory.connect(address, provider);

  await handleNetwork(chainId);

  try {
    isErc721 = await erc721Instance.supportsInterface('0x80ac58cd')
  } catch (e) {
    if (!isErc721) {
      return;
    }
  }

  const casedAddress = address.toLowerCase();

  const collectionId = getCollectionId(chainId, address);
  let totalSupply = BigInt(0);

  if (isErc721) {
    logger.info(`is erc721, address=${address}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await createERC721Datasource({
      address: casedAddress,
    });

    let isERC721Metadata = false;
    let isERC721Enumerable = false;

    try {
      // interface defined: https://eips.ethereum.org/EIPS/eip-721
      [isERC721Enumerable, isERC721Metadata] = await Promise.all([
        erc721Instance.supportsInterface('0x780e9d63'),
        erc721Instance.supportsInterface('0x5b5e139f'),
      ]);
    } catch {}

    let name: string | undefined;
    let symbol: string | undefined;

    if (isERC721Metadata) {
      [name, symbol] = await Promise.all([
        erc721Instance.name(),
        erc721Instance.symbol(),
      ]);
    }

    if (isERC721Enumerable) {
      totalSupply = (await erc721Instance.totalSupply()).toBigInt();
    }

    const collection = Collection.create({
      id: collectionId,
      networkId: chainId,
      contract_address: casedAddress,
      created_block: blockNumber,
      created_timestamp: timestamp,
      creator_address: creatorAddress.toLowerCase(),
      total_supply: totalSupply,
      name,
      symbol,
    });
    await collection.save();
  }
}
