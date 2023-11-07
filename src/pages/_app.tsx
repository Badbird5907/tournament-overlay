import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CssVarsProvider } from "@mui/joy";
import axios from "axios";
import { SWRConfig } from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);
export default function App({ Component, pageProps }: AppProps) {
  return (
    <CssVarsProvider defaultMode="dark">
      <SWRConfig
        value={{
          fetcher,
        }}
      >
        <div className={"min-h-screen"}>
          <Component {...pageProps} />
        </div>
      </SWRConfig>
    </CssVarsProvider>
  );
}
