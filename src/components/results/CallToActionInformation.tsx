/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { AdaptiveStyleEntry, getAdaptiveStyles, useAdaptiveValue } from "components/results/adaptiveStyles";
import { forwardRef } from "react";
import QRCode from "react-qr-code";
import { ScreenSizes } from "util/screenSizes";

export const LinkInformation = forwardRef<HTMLAnchorElement>(() => {
	const url = "https://sassoftware.github.io/";
	const formattedDescription =
		"From data to insights. Faster. Help build the future of AI and analytics with open source tools from SAS.";

	const qrCodeSize = useAdaptiveValue<StyleVariant, number>(styles, "qrCode.size") ?? 120;

	return (
		<Box
			sx={{
				display: "flex",
				...getAdaptiveStyles(styles, {
					flexDirection: "container.flexDirection",
					alignItems: "container.alignItems",
					mt: "container.mt",
				}),
			}}
		>
			<Typography
				data-qa="learn-more-description"
				sx={{
					fontWeight: 700,
					...getAdaptiveStyles(styles, { fontSize: "description.fontSize" }),
				}}
			>
				{formattedDescription}
			</Typography>
			<Stack
				alignItems="center"
				sx={{
					...getAdaptiveStyles(styles, { gap: "qrContainer.gap", mt: "qrContainer.mt", width: "qrContainer.width" }),
				}}
			>
				<QRCode value={url} size={qrCodeSize} />
				<Typography sx={{ ...getAdaptiveStyles(styles, { fontSize: "qrText.fontSize" }) }}>Learn more</Typography>
			</Stack>
		</Box>
	);
});
LinkInformation.displayName = "LinkInformation";

type StyleVariant = {
	container: {
		flexDirection: string;
		alignItems: string;
		mt: number | Record<string, number>;
	};
	button: { transform?: string };
	description: { fontSize: number | Record<string, number> };
	qrContainer: { gap: number; mt: number | Record<string, number>; width: string };
	qrCode: { size: number };
	qrText: { fontSize: number };
};

const styles: AdaptiveStyleEntry<StyleVariant>[] = [
	// Responsive (default)
	{
		styles: {
			container: {
				flexDirection: "column",
				alignItems: "center",
				mt: 3,
			},
			button: {},
			description: {
				fontSize: 18, //{ xs: 16, sm: 18, md: 20 },
			},
			qrContainer: {
				gap: 1,
				mt: 2,
			},
			qrCode: { size: 120 },
		},
	},
	// Landscape
	{
		query: ScreenSizes.landscape,
		styles: {
			container: {
				mt: { xs: 1, lg: 3 },
			},
			description: {
				fontSize: { xs: 15, xl: 18 },
			},
			qrCode: { size: 60 },
		},
	},
	// Portrait
	{
		query: ScreenSizes.portrait,
		styles: {
			container: {
				mt: { xs: 1, lg: 3 },
			},
			description: {
				fontSize: 18,
			},
			qrCode: { size: 120 },
		},
	},
	// Landscape mobile
	{
		query: ScreenSizes.landscapeMobile,
		styles: {
			container: {
				flexDirection: "row",
				alignItems: "top",
				mt: 0,
			},
			description: {
				fontSize: 12,
			},
			qrContainer: {
				gap: 0,
				mt: 0,
				width: "100%",
			},
			qrCode: { size: 55 },
			qrText: { fontSize: 12 },
		},
	},
	// Landscape extra large, e.g. 1536 x 864, 1920 x 1080
	{
		query: ScreenSizes.landscapeXlWidth,
		styles: {
			qrCode: { size: 100 },
		},
	},
	// Portrait 4k (2160+x3700+)
	{
		query: ScreenSizes.portrait4kOrLarger,
		styles: {
			container: {
				mt: 3,
			},
			button: { transform: "scale(1.5)" },
			description: {
				fontSize: 18,
			},
			qrCode: { size: 120 },
		},
	},
];
