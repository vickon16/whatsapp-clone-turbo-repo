import Providers from "@/providers";
import "@/styles/globals.css";
import { cn } from "@/utils";
import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className={cn("h-full w-full antialiased", inter.className)}>
      <Head>
        <title>WhatsApp</title>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <Providers>
        <Component {...pageProps} />
      </Providers>
    </main>
  );
};

export default MyApp;
