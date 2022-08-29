import { IDL } from "./artifacts/solana_contract";

import { Program, Wallet, AnchorProvider } from "@project-serum/anchor";
import { Connection, PublicKey, Keypair, clusterApiUrl } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as bs58 from "bs58";
import 'dotenv/config';

// const SOLANA_LOCK_CONTRACT_PROGRAM_ID = "GBogEvSDTdAJudzPy2EcgTqBy1Tmv8wc2gW3b5ynvxAF"
// const SOLANA_LOCK_CONTRACT_ATA = "FgAxXWnnc48XxcfRzkQFMfaQXzNYctnvVbdhLyTEwC3r"

exports.unlockMetaplexNft = async (
    solanaLockContractProgramId, 
    solanaLockContractATA, 
    ownerPk,
    userTokenAccount
  ) => {
  // userTokenAccount = "8uoNz86PHkhP9TvCjA3hhzHxfnk1YiHdx4Z5SBwsaNfZ"
  const myConnection = new Connection(clusterApiUrl("devnet"));
  const walletKeyPair = Keypair.fromSecretKey(bs58.decode(ownerPk));

  const myWallet = new Wallet(walletKeyPair);
  
  const provider = new AnchorProvider(myConnection, myWallet, AnchorProvider.defaultOptions());

  const program = new Program(
    IDL, 
    solanaLockContractProgramId, 
    provider
  );
  
  let nft_auth_pda: PublicKey;
  let nft_auth_bump: number;

  // Get the authority of NFT
  [nft_auth_pda, nft_auth_bump] = await PublicKey.findProgramAddress([
    Buffer.from("vault-stake-auth"),
  ], program.programId);

  await program.rpc.unlockNft(
    {
      accounts: {
        userAccount: myWallet.publicKey,
        nftLockAccount: solanaLockContractATA,
        userNftTokenAccount: userTokenAccount,
        nftAuth: nft_auth_pda,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      signers: [myWallet.payer]
    }
  );

  const uta = new PublicKey(userTokenAccount);
  let tokenAmount = await myConnection.getTokenAccountBalance(uta);
  console.log(`User ATA token amount: ${tokenAmount.value.amount}`);
  
  const contractATA = new PublicKey(solanaLockContractATA);
  let tokenAmount1 = await myConnection.getTokenAccountBalance(contractATA);
  console.log(`Contract ATA token amount: ${tokenAmount1.value.amount}`);
};