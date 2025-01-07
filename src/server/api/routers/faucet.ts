import { MaestroProvider, UTxO } from "@meshsdk/core";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set.`);
  }
  return value;
};

export const getMaestroApiKey = (): string => {
  return getEnv("MAESTRO_PREPROD_KEY");
};

const apiKey = 'jw0WPcP7Tx5n9C0P0gKKUUT4gX4TfVgG';

const maestroProvider = new MaestroProvider({
  network: "Preprod",
  apiKey: apiKey, // Get yours by visiting https://docs.gomaestro.org/docs/Getting-started/Sign-up-login.
  turboSubmit: false, // Read about paid turbo transaction submission feature at https://docs.gomaestro.org/docs/Dapp%20Platform/Turbo%20Transaction.
});

export const faucetRouter = createTRPCRouter({
  getFaucetUTxO: publicProcedure.query(async () => {
    const utxo: UTxO[] = await maestroProvider.fetchAddressUTxOs(
      "addr_test1wpj47k0wgxqy5qtf9kcvge6xq4y4ua7lvz9dgnc7uuy5ugcz5dr76",
    );
    return utxo;
  }),
});