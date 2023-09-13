import {
  SubstrateExtrinsic,
  SubstrateEvent,
  SubstrateBlock,
} from "@subql/types";
import { Block } from "../types";

export async function handleBlock(block: SubstrateBlock): Promise<void> {
  // Do something with each block handler here
  logger.info(`hash: ${block.block.header.hash.toString()}`)
  Block.create({
    id: block.block.header.number.toString(),
    blockHashes: block.block.header.hash.toString()
  })
}
