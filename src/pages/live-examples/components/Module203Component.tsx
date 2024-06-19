import { CardanoWallet, useNetwork } from "@meshsdk/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";


export default function Module203Component() {
  const network = useNetwork();

  return (
    <>
      <h2 className="my-5 text-2xl font-semibold">
        Module 203: Minting NFTs in an Application
      </h2>
      {network === 0 && (
        <>
          <Card>
            <CardHeader>
              SLT 203.x Demo:
            </CardHeader>
            <CardContent className="w-full">
            </CardContent>
            <CardFooter>Some details</CardFooter>
          </Card>
          <Card>
            <CardHeader>
              SLT 203.x Demo:
            </CardHeader>
            <CardContent className="w-full">
            </CardContent>
            <CardFooter>Some details</CardFooter>
          </Card>
        </>
      )}
    </>
  );
}
