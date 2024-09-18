import { useAddress, useWallet } from "@meshsdk/react";
import { Button } from "../ui/button";
import {
  type Action,
  type Asset,
  type Data,
  type PlutusScript,
  type UTxO,
  resolvePaymentKeyHash,
  resolveScriptRef,
  MeshTxBuilder,
  MaestroProvider,
} from "@meshsdk/core";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import { hexToString } from "~/utils/text";
import usePPBL2024Token from "~/hooks/usePPBL2024Token";

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

function selectUtxoWithMostProjectTokens(inputFaucetUTxOs: UTxO[]): UTxO {
  return inputFaucetUTxOs.reduce((a: UTxO, b: UTxO) => {
    const a_tokens = a.output.amount.find(
      (token) =>
        token.unit ===
        "5e74a87d8109db21fe3d407950c161cd2df7975f0868e10682a3dbfe7070626c323032342d73636166666f6c642d746f6b656e",
    )!;
    const b_tokens = b.output.amount.find(
      (token) =>
        token.unit ===
        "5e74a87d8109db21fe3d407950c161cd2df7975f0868e10682a3dbfe7070626c323032342d73636166666f6c642d746f6b656e",
    )!;
    if (parseInt(a_tokens.quantity) > parseInt(b_tokens.quantity)) {
      return a;
    } else {
      return b;
    }
  });
}

export default function PPBLFaucetWithdrawalTx() {
  const apiKey = getMaestroApiKey();

  const maestro = new MaestroProvider({
    network: "Preprod",
    apiKey: apiKey, // Get yours by visiting https://docs.gomaestro.org/docs/Getting-started/Sign-up-login.
    turboSubmit: false, // Read about paid turbo transaction submission feature at https://docs.gomaestro.org/docs/Dapp%20Platform/Turbo%20Transaction.
  });

  const mesh = new MeshTxBuilder({
    fetcher: maestro,
    submitter: maestro,
    evaluator: maestro,
  });

  const address = useAddress();
  const { wallet } = useWallet();

  const [collateralUTxO, setCollateralUTxO] = useState<UTxO | undefined>(
    undefined,
  );

  const { connectedContribTokenUnit, isLoadingContributor } =
    usePPBL2024Token();

  const [outputFaucetAssets, setOutputFaucetAssets] = useState<
    Asset[] | undefined
  >(undefined);
  const [inputFaucetUTxO, setInputFaucetUTxO] = useState<UTxO | undefined>(
    undefined,
  );

  const [contributorPkh, setContributorPkh] = useState<string | undefined>(
    undefined,
  );

  const [redeemer, setRedeemer] = useState<Pick<Action, "data"> | undefined>(
    undefined,
  );

  // Hard-coded reference UTxO. There are better ways to do this. Explore at Live Coding.
  const referenceUTxO: UTxO = {
    input: {
      outputIndex: 0,
      txHash:
        "1099aafc99e18e36da5933ff81942519f796c6041f5073d99af05c6965d63704",
    },
    output: {
      address:
        "addr_test1qryqg2zrfyhh8qf2j8tg8zg42grnjanj6kjkwzqlrv0dynqey0knpanmr7ef6k2eagl2j4qdukh7r8zke92p56ah0crquj2ugx",
      amount: [{ unit: "lovelace", quantity: "17925290" }],
      scriptRef: resolveScriptRef(_faucetPlutusScript),
    },
  };

  const faucetAssetToBrowserWallet: Asset[] = [
    { unit: "lovelace", quantity: "2000000" },
    {
      unit: "5e74a87d8109db21fe3d407950c161cd2df7975f0868e10682a3dbfe7070626c323032342d73636166666f6c642d746f6b656e",
      quantity: "1000000",
    },
  ];

  // Use Maestro to query input from Faucet address
  const { data: inputFaucetUTxOs, isLoading: isLoadingFaucetUTxO } =
    api.faucet.getFaucetUTxO.useQuery();

  // Calculate the expected output, based on value in input
  // useState and useEffect

  useEffect(() => {
    if (inputFaucetUTxOs) {
      const inputFaucetUTxO = selectUtxoWithMostProjectTokens(inputFaucetUTxOs);
      setInputFaucetUTxO(inputFaucetUTxO);

      if (
        inputFaucetUTxO.output.amount?.[0] &&
        inputFaucetUTxO.output.amount[1]
      ) {
        const updatedQuantity =
          parseInt(inputFaucetUTxO.output.amount[1].quantity) - 1000000;
        const _outputFaucetAssets: Asset[] = [
          inputFaucetUTxO.output.amount[0],
          {
            unit: inputFaucetUTxO.output.amount[1].unit,
            quantity: updatedQuantity.toString(),
          },
        ];
        setOutputFaucetAssets(_outputFaucetAssets);
      }
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

      const _redeemer: Pick<Action, "data"> = {
        data: {
          alternative: 0,
          fields: [contributorPkh, hexToString(_name)],
        },
      };
      setRedeemer(_redeemer);
    }
  }, [connectedContribTokenUnit, contributorPkh]);

  useEffect(() => {
    const getCol = async () => {
      const _col = await wallet.getCollateral();
      if (!!_col && _col.length > 0) {
        setCollateralUTxO(_col[0]);
      }
    };
    if (wallet) {
      void getCol();
    }
  }, [wallet]);

  // redeemer

  // outgoing datum
  const outgoingDatum: Data = {
    alternative: 0,
    fields: [1000000, "ppbl2024-scaffold-token"],
  };

  async function handleFaucetTx() {
    if (inputFaucetUTxOs) {
      try {
        console.log(
          "click!",
          address,
          faucetAssetToBrowserWallet,
          inputFaucetUTxOs,
          outputFaucetAssets,
        );
        if (
          address &&
          faucetAssetToBrowserWallet &&
          inputFaucetUTxO &&
          outputFaucetAssets &&
          !!collateralUTxO
        ) {
          const tx: string = await mesh
            .txIn() // fees
            .txIn() // ppbl2024 token
            .txInCollateral(
              collateralUTxO.input.txHash,
              collateralUTxO.input.outputIndex,
            ) // collateral
            .spendingPlutusScriptV2()
            .txIn(
              inputFaucetUTxO.input.txHash,
              inputFaucetUTxO.input.outputIndex,
            )
            .txInInlineDatumPresent()
            .txInRedeemerValue(redeemer, "JSON")
            .spendingTxInReference(
              referenceUTxO.input.txHash,
              referenceUTxO.input.outputIndex,
            )
            .txOut(address, faucetAssetToBrowserWallet) // faucet token to connected wallet
            .txOut(address, [
              { unit: "lovelace", quantity: "2000000" },
              { unit: connectedContribTokenUnit ?? "", quantity: "1" }, // make a hook!
            ]) // ppbl2024 token back to connected wallet
            .txOut(
              "addr_test1wpj47k0wgxqy5qtf9kcvge6xq4y4ua7lvz9dgnc7uuy5ugcz5dr76",
              outputFaucetAssets,
            ) // faucet validator
            .txOutInlineDatumValue(outgoingDatum, "JSON");

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
      {inputFaucetUTxO ? (
        <>
          {connectedContribTokenUnit ? (
            <>
              <h2>
                Use a PPBL 2024 to withdraw tokens from the PPBL Faucet
                Validator
              </h2>
              <div className="my-3 bg-primary p-3 text-primary-foreground">
                <p>
                  {inputFaucetUTxO?.output.amount[1]?.quantity} Tokens locked in
                  Faucet Address
                </p>
              </div>
              <Button onClick={handleFaucetTx}>
                Withdraw 1000000 Scaffold Tokens from Faucet
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
  code: "590f51590f4e010000332323232323232323232323232332232323232322232322323223232533533300a3357389211944617461206465636f646564207375636365737366756c6c79003333573466e1cd55cea804240004646424660020060046eb8d5d09aba25009375a6ae8540208c98c8074cd5ce00f00e80d99ab9c49011d52656465656d6572206465636f646564207375636365737366756c6c79003333573466e1cd55cea802a40004646424660020060046eb8d5d09aba25006375c6ae8540148c98c8074cd5ce00f00e80d99ab9c49012353637269707420636f6e74657874206465636f646564207375636365737366756c6c79003333573466e1cd55cea80124000466442466002006004646464646464646464646464646666ae68cdc39aab9d500c480008cccccccccccc88888888888848cccccccccccc00403403002c02802402001c01801401000c008cd406806cd5d0a80619a80d00d9aba1500b33501a01c35742a014666aa03ceb94074d5d0a804999aa80f3ae501d35742a01066a03404a6ae85401cccd54078099d69aba150063232323333573466e1cd55cea801240004664424660020060046464646666ae68cdc39aab9d5002480008cc8848cc00400c008cd40c1d69aba150023031357426ae8940088c98c80cccd5ce01a01981889aab9e5001137540026ae854008c8c8c8cccd5cd19b8735573aa004900011991091980080180119a8183ad35742a00460626ae84d5d1280111931901999ab9c034033031135573ca00226ea8004d5d09aba2500223263202f33573806005e05a26aae7940044dd50009aba1500533501a75c6ae854010ccd540780888004d5d0a801999aa80f3ae200135742a00460486ae84d5d1280111931901599ab9c02c02b029135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d55cf280089baa00135742a00460286ae84d5d1280111931900e99ab9c01e01d01b101c13263201c335738921035054350001c135573ca00226ea80044d55cf280089baa001135573ca00226ea800448c88c008dd6000990009aa80a111999aab9f0012500a233500930043574200460066ae880080508c8c8cccd5cd19b8735573aa004900011991091980080180118061aba150023005357426ae8940088c98c8050cd5ce00a80a00909aab9e5001137540024646464646666ae68cdc39aab9d5004480008cccc888848cccc00401401000c008c8c8c8cccd5cd19b8735573aa0049000119910919800801801180a9aba1500233500f014357426ae8940088c98c8064cd5ce00d00c80b89aab9e5001137540026ae854010ccd54021d728039aba150033232323333573466e1d4005200423212223002004357426aae79400c8cccd5cd19b875002480088c84888c004010dd71aba135573ca00846666ae68cdc3a801a400042444006464c6403666ae7007006c06406005c4d55cea80089baa00135742a00466a016eb8d5d09aba2500223263201533573802c02a02626ae8940044d5d1280089aab9e500113754002266aa002eb9d6889119118011bab00132001355011223233335573e0044a010466a00e66442466002006004600c6aae754008c014d55cf280118021aba200301213574200222440042442446600200800624464646666ae68cdc3a800a40004642446004006600a6ae84d55cf280191999ab9a3370ea0049001109100091931900819ab9c01101000e00d135573aa00226ea80048c8c8cccd5cd19b875001480188c848888c010014c01cd5d09aab9e500323333573466e1d400920042321222230020053009357426aae7940108cccd5cd19b875003480088c848888c004014c01cd5d09aab9e500523333573466e1d40112000232122223003005375c6ae84d55cf280311931900819ab9c01101000e00d00c00b135573aa00226ea80048c8c8cccd5cd19b8735573aa004900011991091980080180118029aba15002375a6ae84d5d1280111931900619ab9c00d00c00a135573ca00226ea80048c8cccd5cd19b8735573aa002900011bae357426aae7940088c98c8028cd5ce00580500409baa001232323232323333573466e1d4005200c21222222200323333573466e1d4009200a21222222200423333573466e1d400d2008233221222222233001009008375c6ae854014dd69aba135744a00a46666ae68cdc3a8022400c4664424444444660040120106eb8d5d0a8039bae357426ae89401c8cccd5cd19b875005480108cc8848888888cc018024020c030d5d0a8049bae357426ae8940248cccd5cd19b875006480088c848888888c01c020c034d5d09aab9e500b23333573466e1d401d2000232122222223005008300e357426aae7940308c98c804ccd5ce00a00980880800780700680600589aab9d5004135573ca00626aae7940084d55cf280089baa0012323232323333573466e1d400520022333222122333001005004003375a6ae854010dd69aba15003375a6ae84d5d1280191999ab9a3370ea0049000119091180100198041aba135573ca00c464c6401866ae700340300280244d55cea80189aba25001135573ca00226ea80048c8c8cccd5cd19b875001480088c8488c00400cdd71aba135573ca00646666ae68cdc3a8012400046424460040066eb8d5d09aab9e500423263200933573801401200e00c26aae7540044dd500089119191999ab9a3370ea00290021091100091999ab9a3370ea00490011190911180180218031aba135573ca00846666ae68cdc3a801a400042444004464c6401466ae7002c02802001c0184d55cea80089baa0012323333573466e1d40052002212200223333573466e1d40092000212200123263200633573800e00c00800626aae74dd5000a4c240029201035054310011232300100122330033002002001332323322323322323232332232323232323233223232323232222232323253355335333553011120013500f50132333573466e3cd40208800800405c058cd54c040480048d400488008d5400c888888888888ccd54c07448004cd40794059409c8d400488d4004888800c03040584cd5ce248122496e707574206d75737420696e636c756465205050424c203230323420746f6b656e00015153355335333573466e20ccc0214008d401c88008d401488005200201501610161335738921284d7573742073656e64205050424c203230323420746f6b656e206261636b20746f2073656e64657200015153355335333573466e1cccc0214008d401c88004d401888004d40188800805805440584cd5ce24812153656e646572206d75737420726563656976652066617563657420746f6b656e7300015153355335333573466e24cdc09998041aa99a9804802109a8009100089931900d19ab9c49011466617563657420696e707574206d697373696e670001f2222003350072200135006220013500622002333008355001222200335007220013500622001016015101613357389201374d7573742072657475726e2072656d61696e696e672066617563657420746f6b656e7320746f20636f6e74726163742061646472657373000151533553355333535500122220021501d232321350213333573466e1cd55cea801240004646424660020060046eb8d5d09aba25003375a6ae8540088c98c8078cd5ce249035054310002301c135573ca00226ea800485407884d400488d4024894cd4ccd5cd19b8700400201b01a1333573466e3c00c00406c0684068405440584cd5ce2491343616e6e6f74206368616e676520646174756d00015101510151015101515335533530080032135001223500122223500a2235002222222222222333553020120012235002222253353501822350062232335005233500425335333573466e3c0080040dc0d85400c40d880d88cd401080d894cd4ccd5cd19b8f002001037036150031036153350032153350022133500223350022335002233500223303800200120392335002203923303800200122203922233500420392225335333573466e1c01800c0f00ec54cd4ccd5cd19b8700500203c03b1333573466e1c0100040f00ec40ec40ec40d054cd4004840d040d04cd40d0018014401540bc0284c98c8064cd5ce2481024c660001e130174988854cd40044008884c06d26133355300a12001500850193232350012222222222223335530181200122350022222350042233500225335333573466e3c05c0040ac0a84cd40bc01802040208021409c0294008d400c880084d400488008888c8c8c004014c8004d5407088cd400520002235002225335333573466e3c00802406005c4c01c0044c01800cc8004d5406c88cd400520002235002225335333573466e3c00801c05c05840044c01800c8d400488d4008888888888888cccd40349409094090940908ccd54c06048004cd4064894cd40088400c400540908d4004894cd54cd4ccd5cd19b8f3500222002350042200202001f1333573466e1cd400888004d40108800408007c407c4d40a000c5409c034488cd54c020480048d400488cd5405c008cd54c02c480048d400488cd54068008ccd40048cc0592000001223301700200123301600148000004cd54c020480048d400488cd5405c008ccd40048cd54c030480048d400488cd5406c008d5403400400488ccd5540200440080048cd54c030480048d400488cd5406c008d54030004004ccd55400c030008004444888ccd54c010480054048cd54c020480048d400488cd5405c008d54024004ccd54c0104800488d4008894cd4ccd54c03448004d402d403c8d400488cc028008014018400c4cd405801000d404c004cd54c020480048d400488c8cd5406000cc004014c8004d5406c894cd40044d5402800c884d4008894cd4cc03000802044888cc0080280104c01800c008c8004d5405088448894cd40044008884cc014008ccd54c01c480040140100044484888c00c0104484888c00401048cd401088ccd400c88008008004d400488004c8004d540408844894cd40045403c884cd4040c010008cd54c01848004010004c8004d5403c88448894cd40044d400c88004884ccd401488008c010008ccd54c01c4800401401000448848cc00400c008448cc004894cd40084018400400c88ccd5cd19b8f0020010040031220021220012233700004002464c6400666ae7124012265787065637465642065786163746c79206f6e6520666175636574206f7574707574000084984488008488488cc00401000c448848cc00400c00848488c00800c448800448004448c8c00400488cc00cc008008004cd4488cc0092211c903c419ee7ebb6bf4687c61fb133d233ef9db2f80e4d734db3fbaf0b0048811c5e74a87d8109db21fe3d407950c161cd2df7975f0868e10682a3dbfe0022123300100300220011",
};
