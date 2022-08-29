import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolanaContract } from "../target/types/solana_contract";
import { TOKEN_PROGRAM_ID, Token, ASSOCIATED_TOKEN_PROGRAM_ID, } from '@solana/spl-token';
import { assert, expect } from "chai";
import { Keypair, PublicKey, SystemProgram, Transaction, clusterApiUrl, Connection } from '@solana/web3.js';
import { getKeyPair } from "./utils";

import * as dotenv from "dotenv";
dotenv.config();

describe("Solana NFT-Vault Contract", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolanaContract as Program<SolanaContract>;
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
  // const payer = anchor.web3.Keypair.generate();
  // const nftAuthority = anchor.web3.Keypair.generate();

  let mintNFT: PublicKey;
  let nft_auth_pda = null;
  let nft_auth_bump = null;
  let nft_vault_pda = null;
  let nft_vault_bump = null;
  let userAccount: Keypair;
  let userTokenAccount: PublicKey;

  it("Is initialized!", async () => {
    // Airdrop 1 SOL to payer
    // await provider.connection.confirmTransaction(
    //   await provider.connection.requestAirdrop(payer.publicKey, 3000000000),
    //   "confirmed"
    // );

    // Get the authority of NFT
    [nft_auth_pda, nft_auth_bump] = await PublicKey.findProgramAddress([
      Buffer.from("vault-stake-auth"),
    ], program.programId);
    
    userAccount = getKeyPair(process.env.PRIVATE_KEY);

    let walletPubkey = new anchor.web3.PublicKey(process.env.WALLET_ADDRESS);
    mintNFT = new anchor.web3.PublicKey(process.env.NFT_TOKEN_ADDRESS);
    
    userTokenAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mintNFT,
      walletPubkey
    );
    console.log("User NFT ATA is: ", userTokenAccount.toBase58());

    // Get the pda for vault account which have NFT
    [nft_vault_pda, nft_vault_bump] = await PublicKey.findProgramAddress([
      Buffer.from("vault-stake"),
      mintNFT.toBuffer(),
      userAccount.publicKey.toBuffer(),
    ], program.programId);
    console.log("LockContract ATA is: ", nft_vault_pda.toBase58());

    const receiverAccount = await provider.connection.getAccountInfo(nft_vault_pda);
    if (receiverAccount === null) {
      await program.rpc.initializeLock(
        nft_auth_bump,
        {
          accounts: {
            nftLockAccount: nft_vault_pda,
            nftAuthority: nft_auth_pda,
            userAccount: userAccount.publicKey,
            nftMint: mintNFT,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          },
          signers: [userAccount]
        }
      );
      console.log("Created new ATA...");
    } else {
      console.log("ATA was already created!");
    }

  });

  it('Unlock NFT', async () => {
    await program.rpc.unlockNft(
      {
        accounts: {
          userAccount: userAccount.publicKey,
          nftLockAccount: nft_vault_pda,
          userNftTokenAccount: userTokenAccount,
          nftAuth: nft_auth_pda,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        signers: [userAccount]
      }
    );

    let tokenAmount = await provider.connection.getTokenAccountBalance(userTokenAccount);
    console.log(`User ATA token amount: ${tokenAmount.value.amount}`);
    assert.equal("1", tokenAmount.value.amount);

    let tokenAmount1 = await provider.connection.getTokenAccountBalance(nft_vault_pda);
    console.log(`Contract ATA token amount: ${tokenAmount1.value.amount}`);
    assert.equal("0", tokenAmount1.value.amount);
  });
});
