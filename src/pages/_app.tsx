import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";

import localFont from "next/font/local";

const cera = localFont({ src: "./fonts/Cera-Pro-Regular.woff2" });
const ceraBold = localFont({ src: "./fonts/Cera-Pro-Bold.woff2" });

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className={`${cera.className}`}>
      <Component {...pageProps} />
    </main>
  );
};

export default api.withTRPC(MyApp);
