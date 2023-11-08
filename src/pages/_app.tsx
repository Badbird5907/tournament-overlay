import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CssBaseline as JoyCssBaseline } from "@mui/joy";
import { CssBaseline as MuiCssBaseline } from "@mui/material";
import axios from "axios";
import { SWRConfig } from "swr";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import {
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  experimental_extendTheme as materialExtendTheme,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import DarkMode from "@/components/dark-mode";

const materialTheme = materialExtendTheme();
const fetcher = (url: string) => axios.get(url).then((res) => res.data);
export default function App({ Component, pageProps }: AppProps) {
  return (
    <MaterialCssVarsProvider
      theme={{
        [MATERIAL_THEME_ID]: materialTheme,
      }}
    >
      <JoyCssVarsProvider>
        <MuiCssBaseline />
        <JoyCssBaseline />
        <DarkMode />
        <SWRConfig
          value={{
            fetcher,
          }}
        >
          <div className={"min-h-screen"}>
            <Component {...pageProps} />
          </div>
        </SWRConfig>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
