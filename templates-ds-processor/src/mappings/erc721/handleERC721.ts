import { Collection, ContractType, Nft, Transfer } from '../../types';
import { Erc721__factory } from '../../types/contracts';
import { getCollectionId, getNftId, getTransferId, incrementBigInt } from '../../utils/common';
import { handleMetadata } from '../../utils/utilHandlers';
import assert from 'assert';
import {FrontierEthProvider, FrontierEvmEvent} from "@subql/frontier-evm-processor";
import {BigNumber} from "ethers";
// import {TransferEvent} from "../../types/contracts/Erc721";

type TransferEvent = [string, string, BigNumber] & {
  from: string;
  to: string;
  tokenId: BigNumber;
}

export async function handleERC721(event: FrontierEvmEvent<TransferEvent>): Promise<void> {

  logger.info('hit erc721')
  logger.info(`at ${event.blockNumber}`)
  logger.info(`address: ${event.args?.from}`)

  const collectionId = getCollectionId('1284', event.address);
  const collection = await Collection.get(collectionId);
  if (!collection) {
    logger.warn(`skipped on collection: ${collectionId}`)
    return
  }
  assert(event.args, 'No event args on erc721');

  const nftId = getNftId(collection.id, event.args.tokenId.toString());
  let nft = await Nft.get(nftId);

  const provider = new FrontierEthProvider()
  const instance = Erc721__factory.connect(event.address, provider);

  if (!nft) {
    let metadataUri;
    try {
      metadataUri = collection.name || collection.symbol
        ? await instance.tokenURI(event.args.tokenId)
        : undefined;
    } catch (e) {}

    if (metadataUri){
      await handleMetadata(metadataUri);
    }

    nft = Nft.create({
      id: nftId,
      tokenId: event.args.tokenId.toString(),
      amount: BigInt(1),
      collectionId: collection.id,
      minted_block: BigInt(event.blockNumber),
      minted_timestamp: BigInt(event.blockTimestamp.getTime()),
      minter_address: event.transactionHash?.toLowerCase() ?? '',
      current_owner: event.args.to.toLowerCase(),
      contract_type: ContractType.ERC721,
      metadataId: '',
    });

    try {
      collection.total_supply = (await instance.totalSupply()).toBigInt();
    } catch (e) {
      collection.total_supply = incrementBigInt(collection.total_supply);
    }

    await Promise.all([collection.save(), nft.save()]);
  }

  const transferId = getTransferId(
    chainId,
    event.transactionHash ?? '',
    event.logIndex.toString(),
    0
  );

  const transfer = Transfer.create({
    id: transferId,
    tokenId: event.args.tokenId.toString(),
    amount: BigInt(1),
    networkId: chainId,
    block: BigInt(event.blockNumber),
    timestamp: BigInt(event.blockTimestamp.getTime()),
    transaction_hash: event.transactionHash,
    nftId: nft.id,
    from: event.args.from.toLowerCase(),
    to: event.args.to.toLowerCase(),
  });

  await transfer.save();
}