import QueryByPolicyId from "~/components/queries/blockfrost/QueryByPolicyId";
import QueryTokenDatum from "~/components/queries/maestro/QueryTokenDatum";
import GalleryComponent from "~/components/transactions/Module203/GalleryComponent";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";

export default function Module204Component() {
  return (
    <>
      <h2 className="my-5 text-2xl font-semibold">
        Module 204: Querying the Blockchain
      </h2>
      <>
        <Card>
          <CardHeader>SLT 204.1 Demo: Blockfrost Queries</CardHeader>
          <CardContent className="w-full">
            <QueryByPolicyId />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
        <Card>
          <CardHeader>SLT 204.2 Demo: Maestro Queries</CardHeader>
          <CardContent className="w-full">
            <QueryTokenDatum />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
        <Card>
          <CardHeader>
            SLT 204.3: Using Mesh Providers - view all docs
          </CardHeader>
          <CardContent className="w-full">
            <GalleryComponent />
          </CardContent>
          <CardFooter>
            These are just examples to get you started. To learn more about
            Mesh, view Mesh PBL course. (Note 204.4 leads to Go PBL as well)
          </CardFooter>
        </Card>
      </>
    </>
  );
}
