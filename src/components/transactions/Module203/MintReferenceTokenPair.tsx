// Our app needs to sign this transaction - here's an example of how you might set that up.

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
  type Data,
  type Mint,
  type Recipient,
  Transaction,
} from "@meshsdk/core";
import { imageUrl, referenceValidatorAddress } from "lesson2034.config";

export default function MintReferenceTokenPair() {
  const { wallet } = useWallet();
  const address = useAddress();

  const { data: forgingScript } = api.referenceTokens.forgingScript.useQuery();

  const formSchema = z.object({
    tokenName: z.string().min(8, {
      message: "Token name must be at least 8 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tokenName: "",
    },
  });

  const { mutate } = api.referenceTokens.signAndSubmitMintingTx.useMutation({
    onSuccess: (data) => {
      console.log("Successful TxHash:", data);
      alert("success!");
    },
    onError: (error) => {
      console.error("Error submitting transaction:", error);
      alert(error.message);
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (address && wallet && forgingScript && values.tokenName) {
      const datum: Data = {
        alternative: 0,
        fields: [imageUrl, "Just a G"],
      };
      const referenceTokenRecipient: Recipient = {
        address: referenceValidatorAddress,
        datum: {
          value: datum,
          inline: true,
        },
      };

      const _contribAsset: Mint = {
        assetName: "100" + values.tokenName,
        assetQuantity: "1",
        metadata: [],
        label: "2024",
        recipient: referenceTokenRecipient,
      };
      const _referenceAsset: Mint = {
        assetName: "222" + values.tokenName,
        assetQuantity: "1",
        metadata: [],
        label: "2024",
        recipient: address,
      };
      try {
        const tx = new Transaction({ initiator: wallet });
        tx.mintAsset(forgingScript, _contribAsset);
        tx.mintAsset(forgingScript, _referenceAsset);
        const unsignedTx = await tx.build();
        const _userSignedTx = await wallet.signTx(unsignedTx, true);
        mutate({ unsignedTx: _userSignedTx });
      } catch (error) {
        alert(error);
        console.log(error);
      }
    } else {
      alert("cannot build transaction");
    }
  }

  return (
    <div>
      <h1>Mint a Token Pair</h1>
      <p className="my-5">
        This is very similar to the token you minted in Module 100. There is
        different datum, and the validator code is written in Aiken instead of
        Plutus.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="tokenName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Token Name</FormLabel>
                <FormControl>
                  <Input placeholder="min 8 characters" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Mint my token pair</Button>
        </form>
      </Form>
    </div>
  );
}
