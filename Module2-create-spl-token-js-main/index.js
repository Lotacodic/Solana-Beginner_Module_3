import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
} from "@solana/spl-token";
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

(async () => {
  // Step 1: Connect to cluster and generate a new Keypair
  const connection = new Connection(clusterApiUrl("devnet"), {
    commitment: "confirmed",
  });
  const creators_W = getKeypairFromEnvironment("SECRET_KEY");
  const users_W = getKeypairFromEnvironment("SECRET_KEY_2");
  console.log("Connected and Loaded 🎉");

  // Step 2: Airdrop SOL into your from wallet
  // Skipped

  // Step 3: Create new token mint and get the token account of the fromWallet address
  // If the token account does not exist, create it
  const mint = await createMint(
    connection,
    creators_W,
    creators_W.publicKey,
    null,
    9
  );
  const creators_WTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    creators_W,
    mint,
    creators_W.publicKey
  );

  //Step 4: Mint a new token to the from account
  let signature = await mintTo(
    connection,
    creators_W,
    mint,
    creators_WTokenAccount.address,
    creators_W.publicKey,
    51000000000,
    []
  );
  console.log("mint tx:", signature);

  //Step 5: Get the token account of the to-wallet address and if it does not exist, create it
  const users_WTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    creators_W,
    mint,
    users_W.publicKey
  );

  //Step 6: Transfer the new token to the to-wallet's token account that was just created
  // Transfer the new token to the "toTokenAccount" we just created
  signature = await transfer(
    connection,
    creators_W,
    creators_WTokenAccount.address,
    users_WTokenAccount.address,
    creators_W.publicKey,
    50000000000,
    []
  );
  console.log("transfer tx:", signature);
})();
