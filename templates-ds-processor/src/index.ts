//Exports all handler functions
import "@polkadot/api-augment";
import { atob } from 'abab';

//Exports all handler functions

if (!global.atob) {
    global.atob = atob as any;
}

export * from './mappings/handleTransaction';
export * from './mappings/erc721';