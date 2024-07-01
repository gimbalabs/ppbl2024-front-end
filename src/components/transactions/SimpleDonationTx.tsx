// Example for Lesson 201.3
// Press a button
// Send 5 tAda to hard-coded address

import { useWallet } from "@meshsdk/react";
import { Transaction } from "@meshsdk/core";
import { Button } from "../ui/button";

export default function SimpleDonationTx() {
  // Learn about useWallet: https://meshjs.dev/react/wallet-hooks#useWallet
    const { wallet } = useWallet();

  async function onClick() {
    // Learn about sendLovelace: https://meshjs.dev/apis/transaction
    try {
      const tx = new Transaction({ initiator: wallet }).sendLovelace(
        "addr_test1vpvx0sacufuypa2k4sngk7q40zc5c4npl337uusdh64kv0c7e4cxr", // A Preprod address used by the Mesh team
        "5000000", // 5000000 tLovelace = 5 tAda
      );
      const unsignedTx = await tx.build(); // compare to cardano-cli transaction build
      const signedTx = await wallet.signTx(unsignedTx); // compare to cardano-cli transaction sign
      const txHash = await wallet.submitTx(signedTx); // compare to cardano-cli transaction submit
      alert(`Successful Transaction: ${txHash}`)
    } catch (error) {
      alert(error);
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <p className="text-2xl pb-5">Donate 5 tAda to Mesh Team!</p>
      <Button onClick={onClick}>Donate 5 tAda</Button>
    </div>
  );
}
