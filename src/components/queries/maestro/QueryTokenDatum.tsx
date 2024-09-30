import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import {
  MaestroClient,
  Configuration,
  type UtxoWithSlot,
} from "@maestro-org/typescript-sdk";
import { hexToString } from "@meshsdk/common";

const maestro = new MaestroClient(
  new Configuration({
    apiKey: "292hClTTejbQtFZmxUk5y4LoWjxirYWl",
    network: "Preprod",
  }),
);

export default function QueryTokenDatum() {
  const [data, setData] = useState<UtxoWithSlot[] | undefined>(undefined);
  const [toggleFetchData, setToggleFetchData] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await maestro.addresses.utxosByAddress(
          "addr_test1wq93thc87gxalhkjjhu5003d94xshx94t08hnlmp2x675mctnrx8v",
        );
        if (!!res) {
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
      <h2>Example of a Maestro query</h2>
      <p>
        You could use Blockfrost for this query as well. Note also that we might
        be learning a bit more about the PPBL 2024 token now!
      </p>
      <Button onClick={() => setToggleFetchData(true)}>
        Investigate PPBL 2024 Token datum
      </Button>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {data?.map((d) => (
        <>
          {d.assets[1] && d.datum?.json && (
            <div className="my-3">
              <p key={d.tx_hash + d.index.toString()}>
                {hexToString(d.assets[1]?.unit.substring(62))}:{" "}
              </p>
              <pre>{JSON.stringify(d.datum?.json)}</pre>
            </div>
          )}
        </>
      ))}
    </div>
  );
}
