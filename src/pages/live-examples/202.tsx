import GetStartedConnectWalletComponent from "./components/GetStartedConnectWalletComponent";
import Module202Component from "./components/Module202Component";
import NavigationExamples from "./components/NavigationExamples";

export default function LiveExamplePage202() {
  return (
    <main className="flex flex-col items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center px-5 md:w-2/3">
        <h1 className="my-5 text-4xl">PPBL 2024: Live Examples</h1>
        <GetStartedConnectWalletComponent />
        <Module202Component />
      </div>
      <NavigationExamples />
    </main>
  );
}
