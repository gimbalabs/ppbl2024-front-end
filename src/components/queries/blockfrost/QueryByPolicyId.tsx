import { hexToString } from "@meshsdk/common";
import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";

const blockfrost = axios.create({
  headers: {
    Project_id: process.env.NEXT_PUBLIC_BLOCKFROST_PREPROD_PROJECT_ID,
  },
});

type AssetType = {
  asset: string;
  quantity: string;
};

type ResponseType = {
  data: AssetType[];
  status: number;
};

export default function QueryByPolicyId() {
  const [data, setData] = useState<AssetType[] | undefined>(undefined);
  const [toggleFetchData, setToggleFetchData] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res: ResponseType = await blockfrost.get(
          "https://cardano-preprod.blockfrost.io/api/v0/assets/policy/903c419ee7ebb6bf4687c61fb133d233ef9db2f80e4d734db3fbaf0b",
        );
        if (res.status === 200) {
          setData(res.data);
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
        Fetch a list of all PPBL 2024 Token names
      </Button>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {data?.map((d) => (
        <p key={d.asset}>{hexToString(d.asset.substring(56))}</p>
      ))}
    </div>
  );
}
