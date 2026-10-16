/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import GameContextProvider from "context/GameContext";
import { AppProps } from "next/app";
import Head from "next/head";
import { createDataCatcherTheme } from "util/dataCatcherTheme";

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<meta name="viewport" content="initial-scale=1, width=device-width" />
			</Head>
			<GameContextProvider>
				<ThemeProvider theme={createDataCatcherTheme()}>
					<CssBaseline />
					<Component {...pageProps} />
				</ThemeProvider>
			</GameContextProvider>
		</>
	);
}
