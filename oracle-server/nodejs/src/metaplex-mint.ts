import { Metaplex, keypairIdentity, bundlrStorage, Nft } from "@metaplex-foundation/js";

import { Connection, clusterApiUrl, PublicKey, Keypair } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';
import * as bs58 from "bs58";

// const imageURI = "https://bafybeicu27bhha5jylibfgpcdegfq2xjnbx64byoxwjuenta3hyz66q4bu.ipfs.nftstorage.link/unnamed.jpg"

exports.mintMetaplexNFT = async (tokenURI: string, pk: string) => {
  let privateKey: string = String(pk)
  const myConnection = new Connection(clusterApiUrl("devnet"));

  const walletKeyPair = Keypair.fromSecretKey(bs58.decode(privateKey));

  const metaplex = Metaplex.make(myConnection)
    .use(keypairIdentity(walletKeyPair))
    .use(bundlrStorage({
      address: 'https://devnet.bundlr.network',
      providerUrl: 'https://api.devnet.solana.com',
      timeout: 60000,
  }));

  // const { uri } = await metaplex.nfts().uploadMetadata({
  //   name: "Morris NFT123",
  //   image: imageURI,
  // });

  const { nft } = await metaplex.nfts().create({
    uri: tokenURI
  });
  
  const oldNFT: Nft = await metaplex.nfts().findByMint(nft.mint);

  const userTokenAccount = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    oldNFT.mint,
    walletKeyPair.publicKey
  );

  console.log("Mint is: ", nft.mint.toBase58());
  console.log("User NFT ATA is: ", userTokenAccount.toBase58());

  return [nft.mint.toBase58(), userTokenAccount.toBase58()];
};