/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { createTheme, responsiveFontSizes } from "@mui/material/styles";

//memoize?
export const createDataCatcherTheme = () => {
	let theme = createTheme({
		palette: {
			primary: {
				light: "#91c3fc",
				main: "#4398F9",
				dark: "#0766D1", //sas classic blue
			},
			secondary: {
				main: "#ff8224",
			},
			error: {
				light: "#FF9999",
				main: "#F24949",
				dark: "#CC2D2D",
			},
			text: {
				primary: "#ffffff",
				secondary: "#000000",
			},
		},
		typography: {
			button: { textTransform: "none" },
			fontFamily: ["Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
		},
		components: {
			MuiCssBaseline: {
				styleOverrides: {
					body: {
						backgroundImage: `url(${`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/background.jpg`})`,
						backgroundRepeat: "no-repeat",
						backgroundSize: "cover",
						backgroundPosition: "top",
						backgroundAttachment: "fixed",
					},
				},
			},
		},
	});

	return (theme = responsiveFontSizes(theme));
};
