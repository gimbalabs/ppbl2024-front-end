import { useNetwork } from "@meshsdk/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import SimpleDonationTx from "~/components/transactions/SimpleDonationTx";
import AlwaysSucceedsLockingTx from "~/components/transactions/AlwaysSucceedsLockingTx";

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
            <CardFooter>
              All of the values for this transaction are hard-coded. Try to
              build a form that allows the user to decide how much tAda to
              donate, or one where they can choose from a menu of donation
              recipients.
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              SLT 201.4 Demo: Locking Tokens in the Always Succeeds Validator
            </CardHeader>
            <CardContent className="w-full">
              <AlwaysSucceedsLockingTx />
            </CardContent>
            <CardFooter>Customize this transaction by changing hard-coded values in the AlwaysSucceedsLockingTx component.</CardFooter>
          </Card>
        </>
      )}
    </>
  );
}
