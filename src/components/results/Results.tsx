/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, Container, Paper, Typography } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";
import { AdaptiveStyleEntry, getAdaptiveStyles, useAdaptiveValue } from "components/results/adaptiveStyles";
import { GameContext } from "context/GameContext";
import { ElementType, useContext } from "react";
import { ScreenSizes } from "util/screenSizes";
import { HeadWithMeta } from "../HeadWithMeta";
import { BarChartResultComponent } from "./BarChart";
import { LinkInformation } from "./CallToActionInformation";
import { ResultsFooter } from "./ResultsFooter";

type ResultsComponentProps = {
	host: string | null;
};

export const ResultsComponent = ({ host }: ResultsComponentProps) => {
	const { score } = useContext(GameContext);
	const mainTitleComponent = useAdaptiveValue<StyleVariant, ElementType>(styles, "mainTitle.component") ?? "h1";
	const mainTitleVariant = useAdaptiveValue<StyleVariant, Variant>(styles, "mainTitle.variant") ?? "h2";

	return (
		<Container
			sx={{
				minHeight: `100vh`,
				position: "relative",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				pb: 14,
				...getAdaptiveStyles(styles, {
					maxWidth: "resultsContainer.maxWidth",
					pt: "resultsContainer.pt",
				}),
				paddingBottom: 0,
			}}
		>
			<HeadWithMeta host={host} title="Data Catcher Results" />
			<Typography
				variant={mainTitleVariant}
				component={mainTitleComponent}
				data-qa="data-catcher-title"
				sx={{
					...getAdaptiveStyles(styles, { mb: "mainTitle.mb", mt: "mainTitle.mt" }),
					fontWeight: 700,
					textAlign: "center",
					flexShrink: 0,
				}}
			>
				Data Catcher
			</Typography>
			<Box
				sx={{
					display: "flex",
					flex: 1,
					width: "100%",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Paper
					elevation={3}
					sx={{
						color: "text.secondary",
						display: "flex",
						flexDirection: "column",
						...getAdaptiveStyles(styles, {
							minWidth: "paper.minWidth",
							maxWidth: "paper.maxWidth",
							mt: "paper.mt",
							p: "paper.p",
						}),
					}}
				>
					<Box sx={{ ...getAdaptiveStyles(styles, { py: "container.py" }) }}>
						<Box sx={{ ...getAdaptiveStyles(styles, { pb: "widget.pb" }) }}>
							<Typography
								variant="h3"
								fontWeight={700}
								sx={{ ...getAdaptiveStyles(styles, { fontSize: "title.fontSize" }) }}
							>
								Catch this!
							</Typography>
							<Typography variant="h5" sx={{ ...getAdaptiveStyles(styles, { fontSize: "subtitle.fontSize" }) }}>
								Here's how you stack up
							</Typography>
							<BarChartResultComponent playerData={score} />
						</Box>
						<LinkInformation />
						<ResultsFooter />
					</Box>
				</Paper>
			</Box>
		</Container>
	);
};

type StyleVariant = {
	mainTitle: { component: string; mb: number; mt: number; variant: string };
	resultsContainer: { maxWidth: number | string | Record<string, number | string>; pt: number };
	paper: {
		minWidth: number | Record<string, number | string> | string;
		maxWidth: string | Record<string, number>;
		mt: number;
		p: number | Record<string, number>;
	};
	container: { py: number | Record<string, number> };
	widget: { pb: number | Record<string, number> };
	title: { fontSize: number | Record<string, number> };
	subtitle: { fontSize: number | Record<string, number> };
};

const styles: AdaptiveStyleEntry<StyleVariant>[] = [
	// Responsive (default)
	{
		styles: {
			mainTitle: {
				component: "h1",
				mb: 3,
				mt: 4,
				variant: "h2",
			},
			resultsContainer: {
				maxWidth: {
					xs: "xs",
					sm: "sm",
					md: "md",
					lg: "lg",
					xl: "lg",
				},
				pt: 0,
			},
			paper: {
				mt: 0,
				p: { xs: 3, md: 6 },
			},
			container: { py: 0 },
			widget: { pb: 0 },
			title: {},
			subtitle: {},
		},
	},
	// Landscape
	{
		query: ScreenSizes.landscape,
		styles: {
			paper: {
				maxWidth: "80%",
				p: { xs: 1, md: 3, lg: 6 },
			},
		},
	},
	// Landscape mobile
	{
		query: ScreenSizes.landscapeMobile,
		styles: {
			mainTitle: {
				component: "h3",
				mb: 1,
				mt: 1,
				variant: "h4",
			},
			title: { fontSize: 15 },
			subtitle: { fontSize: 10 },
		},
	},
	// Landscape small, e.g. 800 x 600
	{
		query: ScreenSizes.landscapeSmWidth,
		styles: {
			paper: {
				minWidth: 250,
				maxWidth: "70%",
			},
			title: { fontSize: 30 },
			subtitle: { fontSize: 16 },
		},
	},
	// Landscape medium
	{
		query: ScreenSizes.landscapeMdWidth,
		styles: {
			resultsContainer: {
				maxWidth: 700,
			},
			paper: {
				minWidth: 250,
				maxWidth: "70%",
				p: 2,
			},
			container: { py: 0 },
			title: { fontSize: 35 },
			subtitle: { fontSize: 18 },
		},
	},
	// Landscape large, e.g. 1366 x 768, 1280 x 720
	{
		query: ScreenSizes.landscapeLgWidth,
		styles: {
			resultsContainer: {
				maxWidth: 700,
			},
			paper: {
				minWidth: 250,
				maxWidth: "70%",
				p: 3,
			},
			container: { py: 0 },
			title: { fontSize: 35 },
			subtitle: { fontSize: 18 },
		},
	},
	// Landscape extra large, e.g. 1536 x 864, 1920 x 1080
	{
		query: ScreenSizes.landscapeXlWidth,
		styles: {
			resultsContainer: {
				maxWidth: 1200,
			},
			paper: {
				minWidth: 500,
				maxWidth: "90%",
				p: 3,
			},
			container: { py: 0 },
			title: { fontSize: 40 },
			subtitle: { fontSize: 24 },
		},
	},
	// Portrait
	{
		query: ScreenSizes.portrait,
		styles: {
			paper: {
				mt: 0,
				p: { xs: 1, md: 3, lg: 6 },
			},
			container: { py: { xs: 0, xxl: 5 } },
			widget: { pb: { xs: 1, xl: 5, xxl: 8 } },
			title: { fontSize: { xs: 20, xl: 48, xxl: 60 } },
			subtitle: { fontSize: { xs: 16, xl: 24, xxl: 30 } },
		},
	},
	// Portrait 1080p (1080x1920)
	{
		query: ScreenSizes.portrait1080p,
		styles: {
			container: { py: 0 },
			widget: { pb: 2 },
			title: { fontSize: 32 },
			subtitle: { fontSize: 18 },
		},
	},
	// Portrait HD (1440+x2440+)
	{
		query: ScreenSizes.portraitHDOrLarger,
		styles: {
			container: { py: 0 },
			widget: { pb: 4 },
			title: { fontSize: 46 },
			subtitle: { fontSize: 22 },
		},
	},
	// Portrait 4k (2160+x3700+)
	{
		query: ScreenSizes.portrait4kOrLarger,
		styles: {
			resultsContainer: {
				maxWidth: "xl",
				pt: 4,
			},
			paper: {
				minWidth: "100%",
				mt: 4,
			},
			container: { py: 5 },
			widget: { pb: 6 },
			title: { fontSize: 60 },
			subtitle: { fontSize: 30 },
		},
	},
];
