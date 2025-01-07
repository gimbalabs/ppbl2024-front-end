import { useAddress } from "@meshsdk/react";
import GetStartedConnectWalletComponent from "~/pages/live-examples/components/GetStartedConnectWalletComponent";
import NavigationExamples from "~/pages/live-examples/components/NavigationExamples";


export default function AikenLiveExamplesPage() {
  const address = useAddress();

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center px-5 md:w-2/3">
        <h1 className="my-5 text-4xl">PPBL 2024: Aiken Examples</h1>
        <h2 className="my-5 text-2xl">Coming August 2024</h2>
        {address && (
          <div>
            <p>Your address is {address}</p>
          </div>
        )}
        <GetStartedConnectWalletComponent />
      </div>
      <NavigationExamples />
    </main>
  );
}
