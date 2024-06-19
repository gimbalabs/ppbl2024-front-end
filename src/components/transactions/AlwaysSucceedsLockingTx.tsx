// Example for Lesson 201.4
// Deposit funds at the Always Succeeds Validator
// https://preprod.cardanoscan.io/address/703a888d65f16790950a72daee1f63aa05add6d268434107cfa5b67712

// In this example, we hard-code the values
// Extension #1: Build a form so that user can decide how many tokens to lock, or to change the datum message

// Upcoming Project - Build Your Own Faucet App
// you'll need to create that instance.
// Actually, to do this, you'll need tokens, which is the topic of the next module!
// Then, you'll be able to compile your own validator, as introduced in Module 101
import { useWallet } from "@meshsdk/react";
import { Data, Transaction } from "@meshsdk/core";
import { Button } from "../ui/button";
import Link from "next/link";

export default function AlwaysSucceedsLockingTx() {
  // Learn about useWallet: https://meshjs.dev/react/wallet-hooks#useWallet
  const { wallet } = useWallet();

  // Prepare Datum
  const alwaysSucceedsDatum: Data = {
    alternative: 0,
    fields: ["Hello from PPBL 2024!"], // You can change this message. Then, try to find it via cardano-cli or a blockchain explorer!
  };

  async function onClick() {
    // Learn about sendValue: https://meshjs.dev/apis/transaction#sendValue
    try {
      const tx = new Transaction({ initiator: wallet }).sendAssets(
        {
          address:
            "addr_test1wqag3rt979nep9g2wtdwu8mr4gz6m4kjdpp5zp705km8wys6t2kla", // An Always Succeeds validator on Preprod
          // Learn about Inline Datum: https://meshjs.dev/apis/transaction/smart-contract#inlineDatum
          datum: {
            value: alwaysSucceedsDatum,
            inline: true,
          },
        },
        [{ unit: "lovelace", quantity: "4321765" }], // You can change this amount. In the Mesh documentation, look for ways to add native assets to this output.
      );
      const unsignedTx = await tx.build(); // compare to cardano-cli transaction build
      const signedTx = await wallet.signTx(unsignedTx); // compare to cardano-cli transaction sign
      const txHash = await wallet.submitTx(signedTx); // compare to cardano-cli transaction submit
      alert(`Successful Transaction: ${txHash}`);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <p className="pb-5 text-2xl">
        Lock tAda at the Always Succeeds address on Preprod
      </p>
      <Button onClick={onClick}>Lock 4.321765 tAda</Button>
      <p className="pt-5 text-amber-500 hover:text-amber-300">
        <Link href="https://preprod.cardanoscan.io/address/703a888d65f16790950a72daee1f63aa05add6d268434107cfa5b67712">
          Then, be sure to look for your UTxO, and investigate the Datum
        </Link>
      </p>
    </div>
  );
}
