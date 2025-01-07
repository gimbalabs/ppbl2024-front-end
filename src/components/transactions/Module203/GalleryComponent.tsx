// 1. Get utxos from reference address using Maestro
// 2. Parse the datum with Mesh into a custom type (that will be used in transactions)
// 3. Display image
// 4. With description as caption

import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { parseDatumCbor } from "@meshsdk/core-csl";
import { hexToString } from "@meshsdk/core";

// This will also be helpful in Module 204 -- in fact, maybe that's really what this is for!!

type GalleryDatum = {
  image_url: string;
  description: string;
};

type OnChainDatum = {
  constructor: number;
  fields: [{ bytes: string }, { bytes: string }];
};

export default function GalleryComponent() {
  const [galleryDatum, setGalleryDatum] = useState<GalleryDatum[] | undefined>(
    undefined,
  );

  const { data, isLoading } = api.referenceTokens.getReferenceUTxOs.useQuery();

  useEffect(() => {
    if (data) {
      const result: GalleryDatum[] = [];
      data.forEach((d) => {
        if (d.output.plutusData) {
          const parsedDatum: OnChainDatum = parseDatumCbor(d.output.plutusData);
          const _image_url: string = parsedDatum.fields[0].bytes;
          const _description: string = parsedDatum.fields[1].bytes;

          result.push({
            image_url: hexToString(_image_url),
            description: hexToString(_description),
          });
        }
      });
      setGalleryDatum(result);
    }
  }, [data]);

  if (isLoading) return "Loading";

  return (
    <div>
      <h1>Lesson 203.4 Gallery</h1>
      <div className="grid grid-cols-3 gap-5">
        {galleryDatum?.map((g, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center rounded-lg bg-white p-5 text-black"
          >
            <img src={g.image_url} alt={g.description} />
            <p>{g.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
