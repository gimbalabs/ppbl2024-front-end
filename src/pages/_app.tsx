import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";

import localFont from "next/font/local";
import Navigation from "~/components/Navigation";

const cera = localFont({ src: "./fonts/Cera-Pro-Regular.woff2" });
const ceraBold = localFont({ src: "./fonts/Cera-Pro-Bold.woff2" });

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className={`flex w-full flex-col ${cera.className}`}>
      <div className="flex w-full justify-center py-3">
        <Navigation />
      </div>
      <Component {...pageProps} />
    </main>
  );
};

export default api.withTRPC(MyApp);
