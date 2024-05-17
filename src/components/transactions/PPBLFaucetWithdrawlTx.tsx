import { useAddress, useWallet } from "@meshsdk/react";
import { Button } from "../ui/button";
import {
  Action,
  Asset,
  Data,
  PlutusScript,
  Transaction,
  UTxO,
  resolvePaymentKeyHash,
  resolveScriptRef,
} from "@meshsdk/core";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import { hexToString } from "~/utils/text";
import usePPBL2024Token from "~/hooks/usePPBL2024Token";

export default function PPBLFaucetWithdrawalTx() {
  const address = useAddress();
  const { wallet } = useWallet();
  const { connectedContribTokenUnit, contributorName, isLoadingContributor } =
    usePPBL2024Token();

  const [outputFaucetUTxO, setOutputFaucetUTxO] = useState<
    Partial<UTxO> | undefined
  >(undefined);

  const [contributorPkh, setContributorPkh] = useState<string | undefined>(
    undefined,
  );

  const [redeemer, setRedeemer] = useState<Partial<Action> | undefined>(
    undefined,
  );

  // Hard-coded reference UTxO. There are better ways to do this. Explore at Live Coding.
  const referenceUTxO: UTxO = {
    input: {
      outputIndex: 0,
      txHash:
        "b8f4553d16d9eeb8fdbb55e2c776a9d5fd43004cd1f54120354fb39d761ae2c5",
    },
    output: {
      address:
        "addr_test1qryqg2zrfyhh8qf2j8tg8zg42grnjanj6kjkwzqlrv0dynqey0knpanmr7ef6k2eagl2j4qdukh7r8zke92p56ah0crquj2ugx",
      amount: [{ unit: "lovelace", quantity: "4990980" }],
      scriptRef: resolveScriptRef(_faucetPlutusScript),
    },
  };

  const faucetAssetToBrowserWallet: Asset[] = [
    { unit: "lovelace", quantity: "2000000" },
    {
      unit: "5e74a87d8109db21fe3d407950c161cd2df7975f0868e10682a3dbfe7070626c323032342d73636166666f6c642d746f6b656e",
      quantity: "10",
    },
  ];

  // Use Maestro to query input from Faucet address
  const { data: inputFaucetUTxOs, isLoading: isLoadingFaucetUTxO } =
    api.faucet.getFaucetUTxO.useQuery();

  // Calculate the expected output, based on value in input
  // useState and useEffect

  useEffect(() => {
    if (
      inputFaucetUTxOs?.[0]?.output.amount?.[0] &&
      inputFaucetUTxOs[0].output.amount[1]
    ) {
      const updatedQuantity =
        parseInt(inputFaucetUTxOs[0].output.amount[1].quantity) - 10;
      const _outputFaucetUTxO: Partial<UTxO> = {
        output: {
          address: inputFaucetUTxOs[0].output.address,
          amount: [
            inputFaucetUTxOs[0].output.amount[0],
            {
              unit: inputFaucetUTxOs[0].output.amount[1].unit,
              quantity: updatedQuantity.toString(),
            },
          ],
          plutusData: inputFaucetUTxOs[0].output.plutusData,
        },
      };
      setOutputFaucetUTxO(_outputFaucetUTxO);
    }
  }, [inputFaucetUTxOs]);

  useEffect(() => {
    if (address) {
      const _pkh = resolvePaymentKeyHash(address);
      setContributorPkh(_pkh);
    }
  }, [address]);

  useEffect(() => {
    if (connectedContribTokenUnit && contributorPkh) {
      const _name = connectedContribTokenUnit.substring(56);

      const _redeemer: Partial<Action> = {
        data: {
          alternative: 0,
          fields: [contributorPkh, hexToString(_name)],
        },
      };
      setRedeemer(_redeemer);
    }
  }, [connectedContribTokenUnit, contributorPkh]);

  // redeemer

  // outgoing datum
  const outgoingDatum: Data = {
    alternative: 0,
    fields: [10, "ppbl2024-scaffold-token"], // hex or string??
  };

  async function handleFaucetTx() {
    if (inputFaucetUTxOs) {
      try {
        console.log(
          "click!",
          address,
          faucetAssetToBrowserWallet,
          inputFaucetUTxOs,
          outputFaucetUTxO,
        );
        if (
          address &&
          faucetAssetToBrowserWallet &&
          inputFaucetUTxOs[0] &&
          outputFaucetUTxO
        ) {
          const tx = new Transaction({ initiator: wallet })
            .redeemValue({
              value: inputFaucetUTxOs[0],
              script: referenceUTxO,
              datum: inputFaucetUTxOs[0],
              redeemer: redeemer,
            })
            .sendValue(
              {
                address:
                  "addr_test1wpj47k0wgxqy5qtf9kcvge6xq4y4ua7lvz9dgnc7uuy5ugcz5dr76",
                datum: {
                  value: outgoingDatum,
                  inline: true,
                },
              },
              outputFaucetUTxO,
            )
            .sendAssets(address, faucetAssetToBrowserWallet)
            .sendAssets(address, [
              { unit: "lovelace", quantity: "2000000" },
              { unit: connectedContribTokenUnit, quantity: "1" }, // make a hook!
            ]);

          console.log("Your Tx: ", tx);
          const unsignedTx = await tx.build();
          const signedTx = await wallet.signTx(unsignedTx, true);
          const txHash = await wallet.submitTx(signedTx);
          console.log(txHash);
          alert(
            `Success! You just completed a successful PPBL Faucet transaction. The transaction has is ${txHash}`,
          );
        }
      } catch (error) {
        console.log(error);
        alert(error);
      }
    }
  }

  if (isLoadingFaucetUTxO || isLoadingContributor) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="text-white">
      {inputFaucetUTxOs && inputFaucetUTxOs.length === 1 ? (
        <>
          {connectedContribTokenUnit ? (
            <>
              <h2>
                Use a PPBL 2024 to withdraw tokens from the PPBL Faucet
                Validator (Aiken Version)
              </h2>
              <div className="my-3 bg-primary p-3 text-primary-foreground">
                <p>
                  {inputFaucetUTxOs[0]?.output.amount[1]?.quantity} Tokens
                  locked in Faucet Address
                </p>
              </div>
              <Button onClick={handleFaucetTx}>
                Withdraw 10 Scaffold Tokens from Faucet
              </Button>
            </>
          ) : (
            <>You must mint a PPBL 2024 to interact with the PPBL Faucet Demo</>
          )}
        </>
      ) : (
        <>
          <h2>Cannot find Faucet UTxO</h2>
        </>
      )}
    </div>
  );
}

const _faucetPlutusScript: PlutusScript = {
  version: "V2",
  code: "5903985903950100003332323232323232232232232322322533300b32323232323232323253323301530013016375400426464646464646464a66604060460042646464a666046604c0042646464a66604c605200426464a666050605600426464646464a666054604860566ea80044c8c94ccc0b0c8cdd7980098179baa3010302f37540226002605e6ea80388c0c8c0ccc0cc00454ccc0b001c54ccc0b001854ccc0b000440085280a5014a02940cdc380219b8000301f3371e6eb8c0bcc0b0dd500080d8b180818159baa3010302b375400a6660106eacc02cc0a8dd500481200d9998039bab300a30293754601460526ea802c08c068cdc39998031bab30093028375400404403203466ebcc030c09cdd5180418139baa003300c302737540022c605200266012016460206660086eacc01cc098dd500081100a0b181380099803805118071998011bab300530243754600a60486ea8004080048888c94ccc090c040c094dd50008a400026eb4c0a4c098dd5000992999812180818129baa00114c0103d87a80001323300100137566054604e6ea8008894ccc0a4004530103d87a8000132323253330293371e00e6eb8c0a800c4cdd2a40006605a6ea00052f5c026600a00a0046eb4c0a8008c0b4008c0ac004c8cc004004010894ccc0a0004530103d87a8000132323253330283371e00e6eb8c0a400c4cdd2a4000660586e980052f5c026600a00a0046eacc0a4008c0b0008c0a800458c090004cc0100188cdd7980318109baa001300630213754600460426ea800c8c08cc09000458c084004cc0040108cdd79801980f1baa00100722323300100100322533302100114bd70099192999810180280109981200119802002000899802002000981280118118009180f8009bac301d301e301e0023758603800260306ea8010c068c05cdd50011b874800858c060c064008c05c004c04cdd50039bae30153016002375c602800260206ea8018dd7180918098011bad3011001300d375400c29309b2b2999804980198051baa00113232323253330103013002149858dd7180880098088011bae300f001300b37540022ca66600e600260106ea80084c8c8c8c94ccc038c04400852616375c601e002601e0046eb4c034004c024dd50010b1b8748000dd70009bae0015734aae7555cf2ab9f5740ae855d126011e581c903c419ee7ebb6bf4687c61fb133d233ef9db2f80e4d734db3fbaf0b004c011e581c5e74a87d8109db21fe3d407950c161cd2df7975f0868e10682a3dbfe0001",
};
