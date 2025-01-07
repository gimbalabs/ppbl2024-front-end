import {
  AppWallet,
  ForgeScript,
  MaestroProvider,
  type NativeScript,
  type UTxO,
} from "@meshsdk/core";
import { mintingPkh, referenceValidatorAddress } from "lesson2034.config";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set.`);
  }
  return value;
};

export const getMintingSigningKey = (): string => {
  return getEnv("REF_TOKEN_MINTING_SIGNING_KEY");
};

export const getMaestroApiKey = (): string => {
  return getEnv("MAESTRO_PREPROD_KEY");
};

const mintingSigningKey = 'Random';
const apiKey = 'jw0WPcP7Tx5n9C0P0gKKUUT4gX4TfVgG';

const mintingScript: NativeScript = {
  type: "sig",
  keyHash: mintingPkh,
};

const maestroProvider = new MaestroProvider({
  network: "Preprod",
  apiKey: apiKey, // Get yours by visiting https://docs.gomaestro.org/docs/Getting-started/Sign-up-login.
  turboSubmit: false, // Read about paid turbo transaction submission feature at https://docs.gomaestro.org/docs/Dapp%20Platform/Turbo%20Transaction.
});

const forgingScript = ForgeScript.fromNativeScript(mintingScript);

const policyWallet = new AppWallet({
  networkId: 0,
  fetcher: maestroProvider,
  submitter: maestroProvider,
  key: {
    type: "cli",
    payment: mintingSigningKey,
  },
});

export const referenceTokensRouter = createTRPCRouter({
  getReferenceUTxOs: publicProcedure.query(async () => {
    const utxo: UTxO[] = await maestroProvider.fetchAddressUTxOs(
      referenceValidatorAddress,
    );
    return utxo;
  }),

  forgingScript: publicProcedure.query(() => {
    return forgingScript;
  }),

  signAndSubmitMintingTx: publicProcedure
    .input(z.object({ unsignedTx: z.string().min(3) }))
    .mutation(async ({ input }) => {
      try {
        console.log("check101", input);
        const appSignedTx = policyWallet.signTx(input.unsignedTx, true);
        console.log("check102", appSignedTx);
        const txHash = await policyWallet.submitTx(appSignedTx);
        console.log("Transaction successfully submitted!", txHash);
        return txHash;
      } catch (error) {
        console.error(
          "Error during transaction signing and submission:",
          error,
        );
        throw new Error("Failed to sign or submit transaction");
      }
    }),
});
