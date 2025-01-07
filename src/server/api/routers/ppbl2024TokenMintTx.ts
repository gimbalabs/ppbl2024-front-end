import {
  AppWallet,
  type Asset,
  ForgeScript,
  MaestroProvider,
  type NativeScript,
} from "@meshsdk/core";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { hexToString } from "~/utils/text";

export const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set.`);
  }
  return value;
};

export const getMintingSigningKey = (): string => {
  return getEnv("MINTING_SIGNING_KEY");
};

export const getMaestroApiKey = (): string => {
  return getEnv("MAESTRO_PREPROD_KEY");
}

const mintingSigningKey = getMintingSigningKey();
const apiKey = getMaestroApiKey();

const mintingScript: NativeScript = {
  type: "sig",
  keyHash: "059073352bf8b421340a02574d34d4380346504b0d7d4b022111b316",
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

export const ppbl2024TokenMintTxRouter = createTRPCRouter({
  forgingScript: publicProcedure.query(() => {
    return forgingScript;
  }),


  signAndSubmitTx: publicProcedure
    .input(z.object({ unsignedTx: z.string().min(3) }))
    .mutation(async ({ input }) => {
      try {
        console.log("check101", input);
        const appSignedTx = policyWallet.signTx(input.unsignedTx, true);
        console.log("check102", appSignedTx);
        const txHash = await policyWallet.submitTx(appSignedTx);
        console.log("Transaction successfully submitted!", txHash);
        return txHash;
        throw new Error("Failed to sign the transaction");
      } catch (error) {
        console.error(
          "Error during transaction signing and submission:",
          error,
        );
        throw new Error("Failed to sign or submit transaction");
      }
    }),
});

// 903c419ee7ebb6bf4687c61fb133d233ef9db2f80e4d734db3fbaf0b3232327070626c32303234
