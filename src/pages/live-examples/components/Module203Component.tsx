import { useNetwork } from "@meshsdk/react";
import GalleryComponent from "~/components/transactions/Module203/GalleryComponent";
import MintReferenceTokenPair from "~/components/transactions/Module203/MintReferenceTokenPair";
import UpdateReferenceTokenDatum from "~/components/transactions/Module203/UpdateReferenceTokenDatum";
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
            <CardHeader>SLT 203.4 Demo - Part 1</CardHeader>
            <CardContent className="w-full">
              <MintReferenceTokenPair />
            </CardContent>
            <CardFooter>Reference Token Pair, CIP-68 (sort of), ...</CardFooter>
          </Card>
          <Card>
            <CardHeader>SLT 203.4 Demo - Part 2</CardHeader>
            <CardContent className="w-full">
              <UpdateReferenceTokenDatum />
            </CardContent>
            <CardFooter>Reference Token Pair, CIP-68 (sort of), ...</CardFooter>
          </Card>
          <Card>
            <CardHeader>SLT 203.4 Gallery:</CardHeader>
            <CardContent className="w-full">
              <GalleryComponent />
            </CardContent>
            <CardFooter>Put a gallery here</CardFooter>
          </Card>
        </>
      )}
    </>
  );
}
