import { Html, Head, Main, NextScript } from "next/document";
import { getInitColorSchemeScript } from "@mui/joy";

export default function Document() {
  return (
    <Html lang="en" data-color-scheme="dark">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin={""}
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        />
      </Head>
      <body className={"dark"}>
        {getInitColorSchemeScript({ defaultMode: "dark" })}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
