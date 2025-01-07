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
  type Action,
  type AssetExtended,
  type Data,
  type Recipient,
  Transaction,
  type UTxO,
} from "@meshsdk/core";
import { useEffect, useState } from "react";
import { hexToString } from "@meshsdk/core";
import {
  policyId,
  referenceValidatorAddress,
  scriptReferenceUTxO,
} from "lesson2034.config";

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

  const { data } = api.referenceTokens.getReferenceUTxOs.useQuery();

  // Look for correct policy id in connected wallet.
  // If found, set connectedToken and infer corresponding referenceTokenUnit
  useEffect(() => {
    async function getRefAsset(): Promise<void> {
      const assets: AssetExtended[] = await wallet.getPolicyIdAssets(policyId);
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
        address: referenceValidatorAddress,
        datum: {
          value: updatedDatum,
          inline: true,
        },
      };

      const redeemer: Pick<Action, "data"> = {
        data: {
          alternative: 0,
          fields: [
            values.imageUrl,
            values.description,
            hexToString(connectedToken.substring(62)),
          ],
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
          { unit: referenceTokenUnit ?? "", quantity: "1" },
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
