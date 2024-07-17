// Example for Lesson 202.3
// Press a button, mint a new native asset that only you can mint!

// Similar to
// https://github.com/gimbalabs/ppbl2024-transaction-examples/blob/main/cardano-cli/scripts/module202/mint-native-assets-automate-policy_id.sh

import { useAddress, useWallet } from "@meshsdk/react";
import {
  AssetMetadata,
  ForgeScript,
  Mint,
  NativeScript,
  Transaction,
  resolveNativeScriptHash,
  resolvePaymentKeyHash,
} from "@meshsdk/core";
import { Button } from "../../ui/button";
import { useEffect, useState } from "react";

// Compare to Step by Step instructions in Lesson 202.2 (https://www.andamio.io/course/ppbl2024/202/lesson/2)

// 1. Instead of "Make Keys" we will use the keys from your connected Browser Wallet.
// If you have a connected wallet, then that wallet has a
// Public Key Hash, which is also known as a Payment Key Hash

// 2. Generate Key Hash
// In this example, we can use the Mesh function resolvePaymentKeyHash()

// 3. Create a Script File
// See below

// 4. Generate a Policy ID
// See below

// 5. Set Variables
// Mesh takes care of a lot if it!

// 6. Build, Sign and Submit the Transaction
// See onClick() function below

export function MintNativeAssetWithConnectedPKH() {
  // Learn about useWallet: https://meshjs.dev/react/wallet-hooks#useWallet
  const { wallet } = useWallet();
  const address = useAddress();

  const [connectedPKH, setConnectedPKH] = useState<string | undefined>(
    undefined,
  );
  const [nativeScript, setNativeScript] = useState<NativeScript | undefined>(
    undefined,
  );
  const [forgingScript, setForgingScript] = useState<string | undefined>(
    undefined,
  );
  const [policyId, setPolicyId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (address) {
      // 2. Generate Key Hash
      const _pkh = resolvePaymentKeyHash(address);
      setConnectedPKH(_pkh);

      // 3. Create a Native Script
      const _nativeScript: NativeScript = {
        type: "sig",
        keyHash: _pkh,
      };
      setNativeScript(_nativeScript);

      // 4. Generate a Policy ID

      // Instead of generating a policy id, Mesh uses a "Forging Script"
      const _forgingScript = ForgeScript.fromNativeScript(_nativeScript);
      setForgingScript(_forgingScript);

      // This part is not necessary for the minting transaction to work.
      // However, we include it so that the Policy Id can be displayed in the App UI.
      const _hash = resolveNativeScriptHash(_nativeScript);
      setPolicyId(_hash);
    }
  }, [address]);

  // When button is clicked, start to build the minting transaction
  async function onClick() {
    // Learn about Minting with Mesh: https://meshjs.dev/apis/transaction/minting
    try {
      if (address) {
        // 5. Set Variables
        // You can change these values:
        const assetMetadata: AssetMetadata = {
          name: "My Custom PPBL 2024 Token",
          image: "https://gimbalabs.com/g.png", // can also be IPFS address
          mediaType: "image/png",
          description:
            "This NFT was minted with Mesh in Plutus PBL 2024 at Gimbalabs.",
        };
        const asset: Mint = {
          assetName: "MyCustomPPBL2024Token",
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
        const signedTx = await wallet.signTx(unsignedTx);
        // Submit
        const txHash = await wallet.submitTx(signedTx);
        alert(`Successful Minting Transaction: ${txHash}`);
      }
    } catch (error) {
      alert(error);
      console.log(error);
    }
  }

  // UI Component
  return (
    <div className="grid grid-cols-1 gap-5 px-5 md:grid-cols-2">
      <div className="flex w-full flex-col justify-center">
        <div className="bg-white p-3 text-xs text-black">
          <h2 className="text-lg">Native Script:</h2>
          <pre>{JSON.stringify(nativeScript, null, 2)}</pre>
        </div>
      </div>
      <div className="mx-auto flex w-11/12 flex-col">
        <p className="pb-5 text-lg">Mint a Native Asset</p>

        <p className="my-2 text-left text-xs">
          Your PubKeyHash is: <span className="font-mono">{connectedPKH}</span>
        </p>

        <p className="my-2 text-left text-xs">
          You will mint a token with the Policy Id:{" "}
          <span className="font-mono">{policyId}</span>.
        </p>

        <p className="my-2 text-left text-xs">
          This Policy Id can only be minted by the wallet that is currently
          connected. Try it with a different wallet to see a different result!
        </p>
        <div className="my-5">
          <Button onClick={onClick}>Mint Custom Asset</Button>
        </div>
      </div>
    </div>
  );
}
