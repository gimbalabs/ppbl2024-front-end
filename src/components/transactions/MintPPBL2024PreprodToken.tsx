import {
  AssetMetadata,
  Data,
  Mint,
  Recipient,
  Transaction,
} from "@meshsdk/core";
import { useWallet, useAddress } from "@meshsdk/react";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";

export default function MintPPBL2024PreprodToken() {
  const { connected, wallet } = useWallet();
  const address = useAddress();
  const [asset, setAsset] = useState<Mint | undefined>(undefined);

  const [contributorTokenName, setContributorTokenName] = useState<
    string | undefined
  >(undefined);
  const [successfulTxHash, setSuccessfulTxHash] = useState<string | null>(null);
  const [userSignedTx, setUserSignedTx] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const forgingScript = api.ppbl2024TokenMintTx.forgingScript.useQuery().data;

  const formSchema = z.object({
    tokenAlias: z.string().min(2, {
      message: "Token alias must be at least 2 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tokenAlias: "",
    },
  });

  // Set up the mutation using the trpc hook
  const { mutate } = api.ppbl2024TokenMintTx.signAndSubmitTx.useMutation({
    onSuccess: (data) => {
      // Handle successful transaction submission
      console.log("Transaction Hash:", data);
      setSuccessfulTxHash(data);
      setError("");
    },
    onError: (error) => {
      // Handle any errors
      console.error("Error submitting transaction:", error);
      setError(error.message);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const _tn = "ppbl2024-" + values.tokenAlias;
    setContributorTokenName(_tn);
    console.log("minting", _tn);
  }

  useEffect(() => {
    async function handleMintingTransaction() {
      if (
        address &&
        contributorTokenName &&
        contributorTokenName.length >= 11 &&
        contributorTokenName.startsWith("ppbl2024-") &&
        forgingScript
      ) {
        const assetMetadata: AssetMetadata = {
          name: contributorTokenName,
          image: [
            "ipfs://bafybeiafgc5cptfq5oz4rjt2xjxlm2tvn2espx23nvs6dha3",
            "z6zcnismwy",
          ],
          description: [
            "A CIP-68 style token for participants in",
            "Plutus Project-Based Learning 2024",
            "from Gimbalabs and Friends.",
          ],
          url: "https://plutuspbl.io",
        };

        const contributor_datum: Data = {
          alternative: 0,
          fields: [2024, "info", ""],
        };

        const referenceTokenRecipient: Recipient = {
          address:
            "addr_test1wq93thc87gxalhkjjhu5003d94xshx94t08hnlmp2x675mctnrx8v",
          datum: {
            value: contributor_datum,
            inline: true,
          },
        };

        const _contribAsset: Mint = {
          assetName: "100" + contributorTokenName,
          assetQuantity: "1",
          metadata: assetMetadata,
          label: "721",
          // ahh need datum here xD -- todo
          recipient: referenceTokenRecipient,
        };
        const _referenceAsset: Mint = {
          assetName: "222" + contributorTokenName,
          assetQuantity: "1",
          metadata: assetMetadata,
          label: "721",
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
        alert("Please enter a unique alias for your token.");
      }
    }

    if (address && contributorTokenName) {
      try {
        void handleMintingTransaction();
      } catch (error) {
        console.log(error);
      }
    }
  }, [contributorTokenName]);

  return (
    <div>
      <h2>Mint Your Token!</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="tokenAlias"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter a token alias</FormLabel>
                <FormControl>
                  <Input placeholder="your alias" {...field} />
                </FormControl>
                <FormDescription>
                  Your token will have the name ppbl2024-YOUR_ALIAS
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Mint my token!</Button>
        </form>
      </Form>
    </div>
  );
}
