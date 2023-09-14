import { subqlTest } from "@subql/testing";
import { Account, Transfer } from "../types";

subqlTest(
  "handleEvent test", // Test name
  1000014, // Block height to test at
  [], // Dependent entities
  [
    Transfer.create({
      id: '',
      date: new Date(),
      blockNumber: 10,
      fromId: '',
      toId: '',
      amount: BigInt(1)
    }),
    Account.create({
      id: '',
      publicKey: '',
      firstTransferBlock: 1
    }),
    Account.create({
      id: '',
      publicKey: '',
      firstTransferBlock: 2
    })
  ], // Expected entities
  "handleEvent" // handler name
);
