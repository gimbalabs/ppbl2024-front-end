import { type Asset } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import { useEffect, useState } from "react";
import { hexToString } from "~/utils/text";

export default function usePPBL2024Token() {
  const { wallet } = useWallet();

  const [connectedContribTokenUnit, setConnectedContribTokenUnit] = useState<
    string | undefined
  >(undefined);

  const [contributorName, setContributorName] = useState<string | undefined>(
    undefined,
  );
  const [contributorTokenName, setContributorTokenName] = useState<
    string | undefined
  >(undefined);

  const [isLoadingContributor, setIsLoadingContributor] = useState(true);

  useEffect(() => {
    async function checkPPBLToken() {
      if (wallet) {
        // get contributor token
        const _assets = await wallet.getAssets();
        _assets.forEach((a: Asset) => {
          if (
            a.unit.startsWith(
              "903c419ee7ebb6bf4687c61fb133d233ef9db2f80e4d734db3fbaf0b",
            )
          ) {
            const _tn = hexToString(a.unit.substring(62));
            const _name = hexToString(a.unit.substring(80));
            setConnectedContribTokenUnit(a.unit);
            setContributorTokenName(_tn);
            setContributorName(_name);
          }
        });
        setIsLoadingContributor(false);
      }
    }
    void checkPPBLToken();
  }, [wallet]);

  return {
    connectedContribTokenUnit,
    contributorName,
    contributorTokenName,
    isLoadingContributor,
  };
}
