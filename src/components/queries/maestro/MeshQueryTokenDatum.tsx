import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { hexToString, type UTxO } from "@meshsdk/common";
import { MaestroProvider } from "@meshsdk/provider";
import { parseDatumCbor } from "@meshsdk/core-csl";

const maestroApiKey = process.env.NEXT_PUBLIC_MAESTRO_PREPROD_KEY ?? "";

// Your .env file in Lessons 2024.1 and 204.2
const maestro = new MaestroProvider({
  network: "Preprod",
  apiKey: maestroApiKey,
});

export default function MeshQueryTokenDatum() {
  const [data, setData] = useState<UTxO[] | undefined>(undefined);
  const [toggleFetchData, setToggleFetchData] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await maestro.fetchAddressUTxOs(
          "addr_test1wq93thc87gxalhkjjhu5003d94xshx94t08hnlmp2x675mctnrx8v",
        );
        if (!!res) {
          setData(res);
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
      <Button className="my-3" onClick={() => setToggleFetchData(true)}>
        Investigate PPBL 2024 Token datum - this time using Mesh
      </Button>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {data?.map((utxo) => (
        <>
          {utxo.output.amount[1] && utxo.output.plutusData && (
            <div className="my-3">
              <p key={utxo.input.txHash + utxo.input.outputIndex.toString()}>
                {hexToString(utxo.output.amount[1].unit.substring(62))}:{" "}
              </p>
              <pre>
                {JSON.stringify(parseDatumCbor(utxo.output.plutusData))}
              </pre>
            </div>
          )}
        </>
      ))}
    </div>
  );
}
