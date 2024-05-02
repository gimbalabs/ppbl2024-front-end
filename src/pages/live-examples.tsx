import { CardanoWallet, useAddress, useNetwork } from "@meshsdk/react";
import MintPPBL2024PreprodToken from "~/components/transactions/MintPPBL2024PreprodToken";
import PPBLFaucetWithdrawalTx from "~/components/transactions/PPBLFaucetWithdrawlTx";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";

export default function LiveExamplesPage() {
  const address = useAddress();
  const network = useNetwork();

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center px-5 md:w-2/3">
        <h1 className="my-5 text-4xl">PPBL 2024: Live Examples</h1>
        {address && (
          <div>
            <p>Your address is {address}</p>
          </div>
        )}
        <Card>
          <CardHeader>To get started, connect a wallet.</CardHeader>
          <CardContent>
            <CardanoWallet />
          </CardContent>
          <CardFooter>
            {network === 0 && (
              <div>
                <p>
                  You are connected to Cardano Preprod! Now you can mind a PPBL
                  2024 Preprod Token
                </p>
              </div>
            )}
            {network === 1 && (
              <div className="my-5 rounded-lg bg-red-800 p-5">
                <p>
                  You are connected to Cardano Mainnet. Make sure to change the
                  settings in your wallet so that you are connected to Preprod.
                  To learn more, look at{" "}
                  <a
                    className="text-blue-200 hover:text-blue-400"
                    href="https://v2.andamio.io/course/ppbl2024/100/lesson/1"
                  >
                    Lesson 100.1 of Plutus PBL
                  </a>
                  .
                </p>
              </div>
            )}
          </CardFooter>
        </Card>
        {network === 0 && (
          <>
            <Card>
              <CardHeader>Mint a PPBL 2024 Preprod Token</CardHeader>
              <CardContent className="w-full">
                <MintPPBL2024PreprodToken />
              </CardContent>
              <CardFooter>
                Gimbalabs Open Spaces 2024-05-02: What message should we write
                here?
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>PPBL 2024 Faucet Demo...</CardHeader>
              <CardContent>
                <PPBLFaucetWithdrawalTx />
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}
