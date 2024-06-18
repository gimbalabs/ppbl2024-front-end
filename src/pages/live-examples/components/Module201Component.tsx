import { CardanoWallet, useNetwork } from "@meshsdk/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import MintPPBL2024PreprodToken from "~/components/transactions/MintPPBL2024PreprodToken";
import PPBLFaucetWithdrawalTx from "~/components/transactions/PPBLFaucetWithdrawlTx";
import SimpleDonationTx from "~/components/transactions/SimpleDonationTx";
import PPBLFaucetLockingTx from "~/components/transactions/PPBLFaucetLockingTx";

export default function Module201Component() {
  const network = useNetwork();

  return (
    <>
      <h2 className="my-5 text-2xl font-semibold">
        Module 201: Build a Front End for a Cardano Application
      </h2>
      {network === 0 && (
        <>
          <Card>
            <CardHeader>
              SLT 201.3 Demo: A Simple Spending Transaction
            </CardHeader>
            <CardContent className="w-full">
              <SimpleDonationTx />
            </CardContent>
            <CardFooter>Some details</CardFooter>
          </Card>
          <Card>
            <CardHeader>
              SLT 201.4 Demo: Locking Tokens in the Faucet Validator
            </CardHeader>
            <CardContent className="w-full">
              <PPBLFaucetLockingTx />
            </CardContent>
            <CardFooter>Some details</CardFooter>
          </Card>
        </>
      )}
    </>
  );
}
