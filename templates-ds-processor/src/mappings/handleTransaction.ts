import { handleDsCreation } from '../utils/utilHandlers';
import {FrontierEvmCall} from "@subql/frontier-evm-processor";
import {getContractAddress} from "@ethersproject/address";

export async function handleTransaction(tx: FrontierEvmCall ):Promise<void> {

  logger.info(`contract creation at blockHeight=${tx.blockNumber}`);
  const createsAddress =  getContractAddress({from: tx.from, nonce: tx.nonce})

  if (!createsAddress) {
    return
  }

  logger.info(`tx: ${tx.from}`)
  await handleDsCreation(
    createsAddress,
    BigInt(tx?.blockNumber ?? 0),
    BigInt(tx?.timestamp ?? 0),
    tx.from,
  );
}