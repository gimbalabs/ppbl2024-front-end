import { useNetwork } from "@meshsdk/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import MintPPBL2024PreprodToken from "~/components/transactions/MintPPBL2024PreprodToken";
import PPBLFaucetWithdrawalTx from "~/components/transactions/PPBLFaucetWithdrawlTx";

export default function Module100Component() {
  const network = useNetwork();

  return (
    <>
      <h2 className="my-5 text-2xl font-semibold">
        Module 100: Getting Started with PPBL 2024
      </h2>

      {network === 0 && (
        <>
          <Card>
            <CardHeader>
              SLT 100.4 Demo: Mint a PPBL 2024 Preprod Token
            </CardHeader>
            <CardContent className="w-full">
              <MintPPBL2024PreprodToken />
            </CardContent>
            <CardFooter>
              You will use your PPBL 2024 Preprod Token in a variety of Projects
              throughout this course.
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              SLT 100.5 Demo: A Simple Cardano Application
            </CardHeader>
            <CardContent>
              <PPBLFaucetWithdrawalTx />
            </CardContent>
            <CardFooter>
              We will use these Scaffold tokens to complete examples projects in
              the PPBL 2024 Course.
            </CardFooter>
          </Card>
        </>
      )}
    </>
  );
}
