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
                  You are connected to Cardano Preprod! Now you can mint a PPBL
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
              <CardHeader>SLT 100.4 Demo: Mint a PPBL 2024 Preprod Token</CardHeader>
              <CardContent className="w-full">
                <MintPPBL2024PreprodToken />
              </CardContent>
              <CardFooter>
                You will use your PPBL 2024 Preprod Token in a variety of
                Projects throughout this course.
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>SLT 100.5 Demo: A Simple Cardano Application</CardHeader>
              <CardContent>
                <PPBLFaucetWithdrawalTx />
              </CardContent>
              <CardFooter>
                We will use these Scaffold tokens to complete examples projects
                in the PPBL 2024 Course.
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}
