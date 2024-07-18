// Example for Lesson 202.3
// Press a button, mint a new native asset with an App Wallet

// Similar to
// https://github.com/gimbalabs/ppbl2024-transaction-examples/blob/main/cardano-cli/scripts/module202/mint-native-assets-automate-policy_id.sh

import { useAddress, useWallet } from "@meshsdk/react";
import {
  AppWallet,
  AssetMetadata,
  ForgeScript,
  Mint,
  NativeScript,
  Transaction,
  resolveNativeScriptHash,
  resolvePaymentKeyHash,
  MaestroProvider
} from "@meshsdk/core";
import { Button } from "../../ui/button";

const apiKey = process.env.NEXT_PUBLIC_MAESTRO_PREPROD_KEY

const maestroProvider = new MaestroProvider({
  network: "Preprod",
  apiKey: apiKey ?? "", // Get yours by visiting https://docs.gomaestro.org/docs/Getting-started/Sign-up-login.
  turboSubmit: false, // Read about paid turbo transaction submission feature at https://docs.gomaestro.org/docs/Dapp%20Platform/Turbo%20Transaction.
});

// Compare to Step by Step instructions in Lesson 202.2 (https://www.andamio.io/course/ppbl2024/202/lesson/2)

// 1. Make Keys
// We will use a key generated with Cardano CLI:

const appWallet = new AppWallet({
  networkId: 0,
  key: {
    type: "cli",
    payment:
      "5820b869865d878ecc4d46fbf92be64ab2504d81bb05b9fc60531a7dd3444695d3e0", // THIS IS A PRIVATE KEY - see note
  },
  fetcher: maestroProvider,
  submitter: maestroProvider,
});

// ************************************************************************************************
// *  NOTE:                                                                                       *
// *  The private payment key used above is exactly as valuable as a set of Mnemonics.            *
// *  You should never publicly expose a string like this.                                        *
// *  (We're doing it right now to show you what not to do.)                                      *
// *  If you want to use an app wallet to securely handle existing assets or mint new ones,       *
// *  you must secure the private payment key.                                                    *
// *  Want to learn how? Drop by live coding!                                                     *
// ************************************************************************************************

// 2. Generate Key Hash
// Now that we have an appWallet, we can generate a key hash
// This time, we can store this variable outside of the MintNativeAssetWithAppWallet function,
// because it does not depend on the user's connected wallet
const address = appWallet.getPaymentAddress();
const pkh = resolvePaymentKeyHash(address);

// 3. Create a Script File
const nativeScript: NativeScript = {
  type: "sig",
  keyHash: pkh,
};

// 4. Generate a Policy ID
// Instead of generating a policy id, Mesh uses a "Forging Script"
const forgingScript = ForgeScript.fromNativeScript(nativeScript);

// This part is not necessary for the minting transaction to work.
// However, we include it so that the Policy Id can be displayed in the App UI.
const policyId = resolveNativeScriptHash(nativeScript);

// 5. Set Variables
// Mesh takes care of a lot if it!

// 6. Build, Sign and Submit the Transaction
// See onClick() function below

export function MintNativeAssetWithAppWallet() {
  const { wallet } = useWallet();
  const address = useAddress();

  // When button is clicked, start to build the minting transaction
  async function onClick() {
    // Learn about Minting with Mesh: https://meshjs.dev/apis/transaction/minting
    try {
      if (address) {
        // 5. Set Variables
        // You can change these values:
        const assetMetadata: AssetMetadata = {
          name: "Unsecured PPBL 2024 Token",
          image: "https://gimbalabs.com/g.png", // can also be IPFS address
          mediaType: "image/png",
          description:
            "This NFT was minted with Mesh in Plutus PBL 2024 at Gimbalabs.",
        };
        const asset: Mint = {
          assetName: "UnsecuredPPBL2024Token",
          assetQuantity: "1",
          recipient: address,
          metadata: assetMetadata,
          label: "721",
        };

        // You will learn more about NFTs and Metadata in Module 203.

        // 6. Build, Sign and Submit the Transaction
        // No need to select wallet UTxOs - simply mintAsset!
        const mintingTx = new Transaction({ initiator: wallet }).mintAsset(
          forgingScript,
          asset,
        );

        // Build
        const unsignedTx = await mintingTx.build();
        // Sign
        const appSignedTx = await appWallet.signTx(unsignedTx, true);
        const userSignedTx = await wallet.signTx(appSignedTx, true);
        
        // Submit
        const txHash = await wallet.submitTx(userSignedTx);
        alert(`Successful Minting Transaction: ${txHash}`);
      }
    } catch (error) {
      alert(error);
      console.log(error);
    }
  }

  // UI Component
  return (
    <div className="grid grid-cols-1 gap-5 px-5">
      <div className="flex w-full flex-col justify-center">
        <div className="bg-white p-3 text-xs text-black">
          <h2 className="text-lg">Native Script:</h2>
          <pre>{JSON.stringify(nativeScript, null, 2)}</pre>
        </div>
      </div>
      <div className="mx-auto flex w-11/12 flex-col">
        <p className="pb-5 text-lg">Mint a Native Asset</p>

        <p className="my-2 text-left text-xs">
          The App Wallet PubKeyHash is: <span className="font-mono">{pkh}</span>
        </p>

        <p className="my-2 text-left text-xs">
          This app will mint a token with the Policy Id:{" "}
          <span className="font-mono">{policyId}</span>.
        </p>

        <p className="my-2 text-left text-xs">
          This Policy Id can only be minted with the provided payment key. This
          payment key is not secured and should not be publicly available on
          Github, because now anyone else can steal it to mint their own
          unsecured tokens any time. We hope that this example of &quot;what no
          to do&quot; inspires you!
        </p>
        <div className="my-5">
          <Button onClick={onClick}>Mint Unsecured Asset</Button>
        </div>
      </div>
    </div>
  );
}
