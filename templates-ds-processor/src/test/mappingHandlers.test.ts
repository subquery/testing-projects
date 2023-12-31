import { subqlTest } from '@subql/testing';
import {
    Collection,
    Network,
    Nft,
} from '../types';

subqlTest(
    'Contract without contractCreation event, should still create Collection',
    3110899,
    [
        Network.create({
            id: '1284',
        }),
    ],
    [
        Collection.create({
            id: '1284-0x1f2cd0479c1a6a88190db1a84c34c460d7f55369',
            networkId: '1284',
            contract_address: '0x1f2cd0479c1a6a88190db1a84c34c460d7f55369',
            created_block: BigInt(3110899),
            created_timestamp: BigInt(1678390920),
            creator_address: '0x7d101a07717730043e10a29253c1d5033328f5d8',
            total_supply: BigInt(120),
            name: 'Moonbeam Ignite: The Defi Voyage',
            symbol: 'IGNVYG',
        }),
    ],
    'handleERC721'
);


subqlTest(
    'Moonbeam check block 2921171',
    2921171,
    [
        Network.create({
            id: '1284',
        }),
        Collection.create({
            id: '1284-0x72a33394f0652e2bf15d7901f3cd46863d968424',
            networkId: '1284',
            contract_address: '0x72a33394f0652e2bf15d7901f3cd46863d968424',
            created_block: BigInt(2847447),
            created_timestamp: BigInt(1675158180),
            creator_address: '0x16f615a38528764eea9c6388a8c4e1fc8305cbb3',
            total_supply: BigInt(156),
            name: 'DSP Voyage',
            symbol: 'DSPVoyage',
        }),
    ],
    [
        Nft.create({
            id: '1284-0x72a33394f0652e2bf15d7901f3cd46863d968424-187273',
            tokenId: '187273',
            amount: BigInt(1),
            collectionId: '1284-0x72a33394f0652e2bf15d7901f3cd46863d968424',
            minted_block: BigInt(2921171),
            minted_timestamp: BigInt(1676058720),
            minter_address: '0x16f615a38528764eea9c6388a8c4e1fc8305cbb3',
            current_owner: '0x014536b207090cf1d4d38409f32864e94d6090a5',
            metadataId: '0x0cf99999ab54f7b3',
        }),
    ],
    'handleERC721'
);

// Total Supply increments when failing to get totalSupply from chain
subqlTest(
    'Increment total supply',
    991041,
    [
        Network.create({
            id: '1284',
        }),
        Collection.create({
            id: '1284-0x7d5f0398549c9fdea03bbdde388361827cb376d5',
            networkId: '1284',
            contract_address: '0x7d5f0398549c9fdea03bbdde388361827cb376d5',
            created_block: BigInt(895456),
            created_timestamp: BigInt(1650903414),
            creator_address: '0x0685cd85e129ed712401928cbc6619300e0b2f4f',
            total_supply: BigInt(8144),
            name: 'PNS',
            symbol: 'PNS',
        }),
    ],
    [
        Collection.create({
            id: '1284-0x7d5f0398549c9fdea03bbdde388361827cb376d5',
            networkId: '1284',
            contract_address: '0x7d5f0398549c9fdea03bbdde388361827cb376d5',
            created_block: BigInt(895456),
            created_timestamp: BigInt(1650903414),
            creator_address: '0x0685cd85e129ed712401928cbc6619300e0b2f4f',
            total_supply: BigInt(8145),
            name: 'PNS',
            symbol: 'PNS',
        }),
    ],
    'handleERC721'
);
