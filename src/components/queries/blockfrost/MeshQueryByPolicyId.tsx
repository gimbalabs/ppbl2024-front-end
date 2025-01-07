import { type Asset, hexToString } from "@meshsdk/common";
import { BlockfrostProvider } from "@meshsdk/provider";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";

const blockfrost = new BlockfrostProvider(
  `${process.env.NEXT_PUBLIC_BLOCKFROST_PREPROD_PROJECT_ID}`,
);

export default function MeshQueryByPolicyId() {
  const [data, setData] = useState<Asset[] | undefined>(undefined);
  const [toggleFetchData, setToggleFetchData] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await blockfrost.fetchCollectionAssets(
          "903c419ee7ebb6bf4687c61fb133d233ef9db2f80e4d734db3fbaf0b",
        );
        if (res) {
          setData(res.assets);
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (toggleFetchData) {
      setToggleFetchData(false);
      void fetchData();
    }
  }, [toggleFetchData]);

  return (
    <div>
      <h2>Here is an example of querying by policy id</h2>
      <Button className="my-3" onClick={() => setToggleFetchData(true)}>
        Fetch a list of all PPBL 2024 Token names, using Mesh
      </Button>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {data?.map((d) => (
        <p key={d.unit}>{hexToString(d.unit.substring(56))}</p>
      ))}
    </div>
  );
}
