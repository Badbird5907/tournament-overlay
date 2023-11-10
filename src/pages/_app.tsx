import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import axios from "axios";
import { SWRConfig } from "swr";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
const fetcher = (url: string) => axios.get(url).then((res) => res.data);
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={darkTheme}>
      <SWRConfig
        value={{
          fetcher,
        }}
      >
        <div className={"min-h-screen"}>
          <CssBaseline />
          <Component {...pageProps} />
        </div>
      </SWRConfig>
    </ThemeProvider>
  );
}
