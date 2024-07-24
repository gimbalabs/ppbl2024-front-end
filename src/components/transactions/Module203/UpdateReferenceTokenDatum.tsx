import { zodResolver } from "@hookform/resolvers/zod";
import { useAddress, useWallet } from "@meshsdk/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/utils/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Action,
  AssetExtended,
  Data,
  Mint,
  PlutusScript,
  Recipient,
  Transaction,
  UTxO,
  resolveScriptRef,
} from "@meshsdk/core";
import { useEffect, useState } from "react";
import { hexToString, stringToHex } from "@meshsdk/mesh-csl";

export default function UpdateReferenceTokenDatum() {
  const { wallet } = useWallet();
  const address = useAddress();

  // The 222 token in connected wallet
  const [connectedToken, setConnectedToken] = useState<string | undefined>(
    undefined,
  );

  // Corresponding 100 token
  const [referenceTokenUnit, setReferenceTokenUnit] = useState<
    string | undefined
  >(undefined);

  // UTxO with 100 token
  const [referenceInputUTxO, setReferenceInputUTxO] = useState<
    UTxO | undefined
  >(undefined);

  const { data, isLoading } = api.referenceTokens.getReferenceUTxOs.useQuery();

  // Look for correct policy id in connected wallet.
  // If found, set connectedToken and infer corresponding referenceTokenUnit
  useEffect(() => {
    async function getRefAsset(): Promise<void> {
      const assets: AssetExtended[] = await wallet.getPolicyIdAssets(
        "f0b4a6a154322282237eec2e22e15bc55c97ca66cf92db5a9ba42a80",
      );
      if (assets[0]) {
        const _unit: string = assets[0].unit;
        if (_unit) {
          setConnectedToken(_unit);
          const _token100 =
            assets[0].unit.substring(0, 56) +
            "313030" +
            assets[0].unit.substring(62);
          setReferenceTokenUnit(_token100);
        }
      }
    }

    if (wallet) {
      void getRefAsset();
    }
  }, [wallet]);

  // With referenceTokenUnit set, we can find the correct input UTxO
  // The holder of 222 token can update the datum
  useEffect(() => {
    if (referenceTokenUnit && data) {
      const _utxo = data.find((utxo) =>
        utxo.output.amount.find((a) => a.unit == referenceTokenUnit),
      );
      setReferenceInputUTxO(_utxo);
    }
  }, [referenceTokenUnit, data]);

  const formSchema = z.object({
    imageUrl: z
      .string()
      .min(10, {
        message: "Image URL must be at least 10 characters.",
      })
      .max(56, { message: "Image URL can be at most 56 characters." }),
    description: z
      .string()
      .min(3, {
        message: "Description must be at least 3 characters.",
      })
      .max(56, { message: "Description can be at most 56 characters." }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: "",
      description: "",
    },
  });

  // onSubmit: if form values are valid, then Build, Sign and Submit Tx
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (
      address &&
      wallet &&
      values.imageUrl &&
      values.description &&
      connectedToken &&
      referenceInputUTxO
    ) {
      const updatedDatum: Data = {
        alternative: 0,
        fields: [values.imageUrl, values.description],
      };
      const referenceTokenRecipient: Recipient = {
        address:
          "addr_test1wq8srpa86unvl7whmf8ct9fja8zrnvgv5ejgw68ead27desd63s48",
        datum: {
          value: updatedDatum,
          inline: true,
        },
      };

      const redeemer: Partial<Action> = {
        data: {
          alternative: 0,
          fields: [
            values.imageUrl,
            values.description,
            hexToString(connectedToken.substring(62)),
          ],
        },
      };

      // Upcoming Mesh release improves how reference UTxOs are used:
      const scriptReferenceUTxO: UTxO = {
        input: {
          txHash:
            "56034576d8691f5608efa4b71153883735fa0d6280835e456f4c04847a2b4fd1",
          outputIndex: 0,
        },
        output: {
          address:
            "addr_test1qpy5pxpz96h673r9qu592hurf2tw72nx6fn5eytksgf5ghydkhtdsytfajqartg2jpd0p4kt3frs6ga579a05w6hy8nqtvjuqj",
          amount: [{ unit: "lovelace", quantity: "4934950" }],
          scriptRef: resolveScriptRef(referenceScriptFromAiken),
        },
      };

      // Upcoming Mesh release provides a new transaction builder that looks more like Cardano CLI
      // This "Mesh V1" approach will still work:
      try {
        const tx = new Transaction({ initiator: wallet });
        tx.redeemValue({
          value: referenceInputUTxO,
          script: scriptReferenceUTxO,
          datum: referenceInputUTxO,
          redeemer: redeemer,
        });
        tx.sendAssets(referenceTokenRecipient, [
          { unit: "lovelace", quantity: "2000000" },
          { unit: referenceTokenUnit, quantity: "1" },
        ]);
        tx.sendAssets(address, [
          { unit: "lovelace", quantity: "2000000" },
          { unit: connectedToken, quantity: "1" },
        ]);

        const unsignedTx = await tx.build();
        const userSignedTx = await wallet.signTx(unsignedTx, true);
        const txHash = await wallet.submitTx(userSignedTx);
        console.log(txHash);
      } catch (error) {
        alert(error);
        console.log(error);
      }
    } else {
      alert("Please enter a unique alias for your token.");
    }
  }
  return (
    <div>
      <h1 className="mb-3">Update Reference Token Datum:</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter New Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="min 10 characters" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter New Description</FormLabel>
                <FormControl>
                  <Input placeholder="min 3 characters" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update my token info</Button>
        </form>
      </Form>
    </div>
  );
}

const referenceScriptFromAiken: PlutusScript = {
  version: "V2",
  code: "59038801000033232323232323223223232232253330093232323232323232533233012300130133754004264646464646464646464a66603e60440042646464a666044604a0042646464a66604a605000426464a66604e6054004264a66604a66e1d20043026375400226464a66604e66e3cdd7180798149baa00201d153330273371e6eb8c02cc0a4dd500100d8a999813980b1998041bab300b30293754601660526ea803009404454ccc09cc058ccc020dd5980598149baa00902501113375e601e60526ea8c02cc0a4dd5003180798149baa00414a029405280a503022001302a302737540022c605260546054604c6ea801858c0a0004cc0240348c048ccc010dd5980398129baa00102100c1630260013300700c230103330023756600a60466ea8c014c08cdd500080f805111192999811980918121baa0011480004dd6981418129baa001325333023301230243754002298103d87a80001323300100137566052604c6ea8008894ccc0a0004530103d87a80001323232325333029337220100042a66605266e3c0200084cdd2a40006605a6ea00052f5c02980103d87a8000133006006003375a60540066eb8c0a0008c0b0008c0a8004c8cc004004010894ccc09c0045300103d87a80001323232325333028337220100042a66605066e3c0200084cdd2a4000660586e980052f5c02980103d87a8000133006006003375660520066eb8c09c008c0ac008c0a400458c08c004cc0100208cdd7980318101baa001300630203754600460406ea800c8c088c08c00458c080004cc0040188cdd79801980e9baa00100922323300100100322533302000114bd7009919299980f980280109981180119802002000899802002000981200118110009180f00099b8a489033232320000a337149101033130300000937586034603660360046eb0c064004c054dd5002180b980a1baa002370e90010b180a980b001180a00098081baa006375c602460260046eb8c044004c044008dd7180780098059baa00314984d9594ccc01ccdc3a400060106ea80044c8c8c8c8c8c94ccc040c04c00852616375c602200260220046eb8c03c004c03c008dd7180680098049baa001163001002253330053370e900018031baa001132323232533300c300f002149858dd7180680098068011bae300b001300737540022c6eb80055cd2ab9d5573caae7d5d02ba157449811e581cf0b4a6a154322282237eec2e22e15bc55c97ca66cf92db5a9ba42a800001",
};
