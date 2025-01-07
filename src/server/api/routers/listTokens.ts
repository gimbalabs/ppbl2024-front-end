import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { MaestroProvider } from "@meshsdk/provider";
import { type Asset } from "@meshsdk/common";

import { hexToString } from "~/utils/text";


const maestroProvider = new MaestroProvider({
    network: "Preprod",
    apiKey: "jw0WPcP7Tx5n9C0P0gKKUUT4gX4TfVgG", // Get yours by visiting https://docs.gomaestro.org/docs/Getting-started/Sign-up-login.
    turboSubmit: false, // Read about paid turbo transaction submission feature at https://docs.gomaestro.org/docs/Dapp%20Platform/Turbo%20Transaction.
  });

export const listTokensRouter = createTRPCRouter({

    listTokenNames: publicProcedure.query(async () => {
        const _tns: { assets: Asset[]; next: string | number | null } =
          await maestroProvider.fetchCollectionAssets(
            "903c419ee7ebb6bf4687c61fb133d233ef9db2f80e4d734db3fbaf0b",
          );
        const _222s = _tns.assets.filter((a) =>
          a.unit.startsWith(
            "903c419ee7ebb6bf4687c61fb133d233ef9db2f80e4d734db3fbaf0b" + "313030", //changed this from 323232 to 313030, something has changed wiith the api response, the unit field returns a different hex string. interesting to know why
          ),
        );
        const _names: string[] = [];
        _222s.forEach((n) => {
          _names.push(hexToString(n.unit.substring(80)));
        });
        return _names;
      }),


});