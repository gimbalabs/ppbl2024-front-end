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
import { register } from "module";
import usePPBL2024Token from "~/hooks/usePPBL2024Token";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

export default function MintPPBL2024PreprodToken() {
  const { wallet } = useWallet();
  const address = useAddress();
  const { connectedContribTokenUnit, contributorName, isLoadingContributor } =
    usePPBL2024Token();

  const [contributorTokenName, setContributorTokenName] = useState<
    string | undefined
  >(undefined);

  const [tokenNameExists, setTokenNameExists] = useState<boolean>(false);

  const { data: listTokenNames } =
    api.listTokens.listTokenNames.useQuery();

 const { data: forgingScript } =
   api.ppbl2024TokenMintTx.forgingScript.useQuery();

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
    mode: "onChange",
  });

  const { mutate } = api.ppbl2024TokenMintTx.signAndSubmitTx.useMutation({
    onSuccess: (data) => {
      console.log("Transaction Hash:", data);
      alert("You successfully minted a PPBL 2024 Token!");
    },
    onError: (error) => {
      console.error("Error submitting transaction:", error);
      alert(error.message);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (listTokenNames?.includes(values.tokenAlias)) {
      alert(
        `The token alias ${values.tokenAlias} is already minted. Please try a different one.`,
      );
    } else {
      const _tn = "ppbl2024-" + values.tokenAlias;
      setContributorTokenName(_tn);
      console.log("minting", _tn);
    }
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

  if (isLoadingContributor) {
    return <div className="animate-pulse">Loading Contributor Status</div>;
  }

  return (
    <div className="flex w-full flex-col">
      {connectedContribTokenUnit ? (
        <h2>You have a PPBL 2024 Preprod Token!</h2>
      ) : (
        <>
          <h2>Mint Your PPBL 2024 Token</h2>
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
              {!!listTokenNames &&
                listTokenNames.includes(form.getValues().tokenAlias) && (
                  <div className="bg-orange-700 p-3">
                    This tokenAlias is already minted. Please choose a different
                    alias.
                  </div>
                )}
              <Button type="submit">Mint my token!</Button>
            </form>
          </Form>
        </>
      )}
      <Accordion type="single" collapsible>
        <AccordionItem value="faucet-1">
          <AccordionTrigger>
            View List of PPBL 2024 Preprod Tokens
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {listTokenNames?.map((t, i) => (
                <div key={i} className="flex w-full justify-center items-center bg-accent p-2 text-accent-foreground">
                  {t}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
