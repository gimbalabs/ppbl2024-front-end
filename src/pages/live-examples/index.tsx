import { useAddress } from "@meshsdk/react";
import Module100Component from "./components/Module100Component";
import GetStartedConnectWalletComponent from "./components/GetStartedConnectWalletComponent";
import NavigationExamples from "./components/NavigationExamples";

export default function LiveExamplesPage() {
  const address = useAddress();

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center px-5 md:w-2/3">
        <h1 className="my-5 text-4xl">PPBL 2024: Live Examples</h1>
        {address && (
          <div>
            <p>Your address is {address}</p>
          </div>
        )}
        <GetStartedConnectWalletComponent />
        <Module100Component />
      </div>
      <NavigationExamples />
    </main>
  );
}
