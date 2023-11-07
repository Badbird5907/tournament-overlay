import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CssVarsProvider } from "@mui/joy";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CssVarsProvider defaultMode="dark">
      <div className={"min-h-screen"}>
        <Component {...pageProps} />
      </div>
    </CssVarsProvider>
  );
}
