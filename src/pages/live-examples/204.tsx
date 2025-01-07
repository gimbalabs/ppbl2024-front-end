import GetStartedConnectWalletComponent from "./components/GetStartedConnectWalletComponent";
import Module204Component from "./components/Module204Component";
import NavigationExamples from "./components/NavigationExamples";

export default function LiveExamplePage204() {
  return (
    <main className="flex flex-col items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center px-5 md:w-2/3">
        <h1 className="my-5 text-4xl">PPBL 2024: Live Examples</h1>
        <GetStartedConnectWalletComponent />
        <Module204Component />
      </div>
      <NavigationExamples />
    </main>
  );
}
