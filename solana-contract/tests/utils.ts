import { Keypair } from '@solana/web3.js';
import * as anchor from "@project-serum/anchor";
import * as bs58 from "bs58";

export function getKeyPair(secretkey: string):Keypair {
    return Keypair.fromSecretKey(bs58.decode(secretkey));
};