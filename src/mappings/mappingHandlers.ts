import {
  SubstrateExtrinsic,
  SubstrateEvent,
  SubstrateBlock,
  LightSubstrateEvent,
} from "@subql/types";
import { Account, Transfer } from "../types";
import { Balance } from "@polkadot/types/interfaces";
import { decodeAddress } from "@polkadot/util-crypto";

export async function handleEvent(event: LightSubstrateEvent): Promise<void> {
  // export async function handleEvent(event: SubstrateEvent): Promise<void> {
  
  const caster = event as any
  logger.info(`Event: ${JSON.stringify(caster, null, 2)}`)
  if(caster?.block?.timestamp) {
    throw new Error('Not light block')
  }

  logger.info(
    `New transfer event found at block ${event.block.block.header.number.toString()}`
  );

  // Get data from the event
  // The balances.transfer event has the following payload \[from, to, value\]
  // logger.info(JSON.stringify(event));
  const {
    event: {
      data: [from, to, amount],
    },
  } = event;

  const blockNumber: number = event.block.block.header.number.toNumber();

  const fromAccount = await checkAndGetAccount(from.toString(), blockNumber);
  const toAccount = await checkAndGetAccount(to.toString(), blockNumber);

  // Create the new transfer entity
  const transfer = Transfer.create({
    id: `${event.block.block.header.number.toNumber()}-${event.idx}`,
    blockNumber,
    fromId: fromAccount.id,
    toId: toAccount.id,
    amount: (amount as Balance).toBigInt(),
  });

  fromAccount.lastTransferBlock = blockNumber;
  toAccount.lastTransferBlock = blockNumber;

  await Promise.all([fromAccount.save(), toAccount.save(), transfer.save()]);
}

async function checkAndGetAccount(
  id: string,
  blockNumber: number
): Promise<Account> {
  let account = await Account.get(id.toLowerCase());
  if (!account) {
    // We couldn't find the account
    account = Account.create({
      id: id.toLowerCase(),
      publicKey: decodeAddress(id).toString().toLowerCase(),
      firstTransferBlock: blockNumber,
    });
  }
  return account;
}
