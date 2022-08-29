import { SolanaContract, IDL } from "../target/types/solana_contract";
import { assert, expect } from "chai";
import { Program, Provider, web3, Wallet, AnchorProvider, Idl } from "@project-serum/anchor";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, Token, ASSOCIATED_TOKEN_PROGRAM_ID, } from '@solana/spl-token';
import * as bs58 from "bs58";
import 'dotenv/config';

const SOLANA_LOCK_CONTRACT_PROGRAM_ID = "GBogEvSDTdAJudzPy2EcgTqBy1Tmv8wc2gW3b5ynvxAF"
const SOLANA_LOCK_CONTRACT_ATA = "FgAxXWnnc48XxcfRzkQFMfaQXzNYctnvVbdhLyTEwC3r"

describe("Solana NFT-Vault Contract", () => {
  it("Is initialized!", async () => {
    const userTokenAccount = "8uoNz86PHkhP9TvCjA3hhzHxfnk1YiHdx4Z5SBwsaNfZ"
    const myConnection = new Connection("https://api.devnet.solana.com", "confirmed");
    const walletKeyPair = Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY));

    const myWallet = new Wallet(walletKeyPair);
    
    const provider = new AnchorProvider(myConnection, myWallet, AnchorProvider.defaultOptions());

    const program = new Program(
      IDL, 
      SOLANA_LOCK_CONTRACT_PROGRAM_ID, 
      provider
    );


    await program.rpc.lockNft(
      {
        accounts: {
          nftLockAccount: SOLANA_LOCK_CONTRACT_ATA,
          userAccount: myWallet.publicKey,
          userNftTokenAccount: userTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        signers: [myWallet.payer]
      }
    );
    // try {
    //   await program.rpc.lockNft({
    //     accounts: {
    //       nftLockAccount: SOLANA_LOCK_CONTRACT_ATA,
    //       userAccount: myWallet.publicKey,
    //       userNftTokenAccount: userTokenAccount,
    //       tokenProgram: TOKEN_PROGRAM_ID,
    //     } as any,
    //     signers: [myWallet] as any
    //   });
    // } catch (err) {
    //   console.log("Transaction error:", err);
    // }
    const uta = new PublicKey(userTokenAccount);
    let tokenAmount = await myConnection.getTokenAccountBalance(uta);
    console.log(`User ATA token amount: ${tokenAmount.value.amount}`);
    // assert.equal("0", tokenAmount.value.amount);
    const nvp = new PublicKey(SOLANA_LOCK_CONTRACT_ATA);
    let tokenAmount1 = await myConnection.getTokenAccountBalance(nvp);
    console.log(`Contract ATA token amount: ${tokenAmount1.value.amount}`);
    // assert.equal("1", tokenAmount1.value.amount);
  });
});