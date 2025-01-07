import { CardanoWallet, useNetwork } from "@meshsdk/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";

export default function GetStartedConnectWalletComponent() {
  const network = useNetwork();

  return (
    <Card>
      <CardHeader>To get started, connect a wallet.</CardHeader>
      <CardContent>
        <CardanoWallet />
      </CardContent>
      <CardFooter>
        {network === 0 && (
          <div>
            <p>
              You are connected to Cardano Preprod! Now you can mint a PPBL 2024
              Preprod Token
            </p>
          </div>
        )}
        {network === 1 && (
          <div className="my-5 rounded-lg bg-red-800 p-5">
            <p>
              You are connected to Cardano Mainnet. Make sure to change the
              settings in your wallet so that you are connected to Preprod. To
              learn more, look at{" "}
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
  );
}
