/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, Typography } from "@mui/material";
import { convertColor, DataCatcher } from "components/constants";
import { Bar, BarChart, CartesianGrid, CartesianPosition, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { PlayerScores } from "util/dataCatcherTypes";
import { ScreenSizes } from "util/screenSizes";
import { AdaptiveStyleEntry, getAdaptiveStyles, useAdaptiveValue } from "./adaptiveStyles";

type BarChartResultProps = {
	playerData?: PlayerScores;
};

export const BarChartResultComponent = ({ playerData }: BarChartResultProps) => {
	const emptyScores = {
		playerOne: {
			score: 0,
			caughtBalls: 0,
			uncaughtBalls: 0,
			doublePoints: 0,
			singlePoints: 0,
		},
		playerTwo: {
			score: 0,
			caughtBalls: 0,
			uncaughtBalls: 0,
			doublePoints: 0,
			singlePoints: 0,
		},
	};

	const chartFontSize = useAdaptiveValue<StyleVariant, number>(styles, "chart.fontSize") ?? 16;
	const chartLegendMarginLeft = useAdaptiveValue<StyleVariant, string>(styles, "chart.legendMarginLeft") ?? "40px";
	const chartLegendPosition =
		useAdaptiveValue<StyleVariant, CartesianPosition | undefined>(styles, "chart.legendPosition") ?? "bottom";
	const chartXAxisInterval = useAdaptiveValue<StyleVariant, number>(styles, "chart.xAxisInterval") ?? 0;

	const scores = playerData ?? emptyScores;
	const chartData = [
		{ key: "Score", playerOne: scores.playerOne.score, playerTwo: scores.playerTwo.score },
		{ key: "Caught Balls", playerOne: scores.playerOne.caughtBalls, playerTwo: scores.playerTwo.caughtBalls },
		{
			key: "Uncaught Balls",
			playerOne: scores.playerOne.uncaughtBalls,
			playerTwo: scores.playerTwo.uncaughtBalls,
		},
		{
			key: "Double Points",
			playerOne: scores.playerOne.doublePoints,
			playerTwo: scores.playerTwo.doublePoints,
		},
		{
			key: "Single Points",
			playerOne: scores.playerOne.singlePoints,
			playerTwo: scores.playerTwo.singlePoints,
		},
	];

	const renderCustomBarLabel = ({ x, y, width, height, value }: any) => {
		if (Math.round(height) < 20) {
			return (
				<text
					x={x + width / 2}
					y={y}
					fill="#666"
					textAnchor="middle"
					dy={-6}
					fontSize={chartFontSize}
				>{`${value}`}</text>
			); // Don't render label if height is too small
		}
		return (
			<text
				x={x + width / 2}
				y={y + height / 2}
				fill="#fff"
				textAnchor="middle"
				dy={4}
				fontSize={chartFontSize}
			>{`${value}`}</text>
		);
	};

	let winner = "";
	if (!playerData) {
		winner = "No results found.  Please play again.";
	} else if (playerData.playerOne.score > playerData.playerTwo.score) {
		winner = "Player 1 Won!";
	} else if (playerData.playerOne.score < playerData.playerTwo.score) {
		winner = "Player 2 Won!";
	} else {
		winner = "It's a Tie!";
	}

	return (
		<Box
			sx={{
				...getAdaptiveStyles(styles, { aspectRatio: "container.aspectRatio", mt: "container.mt" }),
				width: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Typography
				fontWeight={700}
				sx={{
					...getAdaptiveStyles(styles, { fontSize: "title.fontSize", mb: "title.mb", ml: "title.ml" }),
					lineHeight: "26px",
					color: "#000000",
				}}
			>
				{winner}
			</Typography>

			<ResponsiveContainer width="100%" height="100%">
				<BarChart
					data={chartData}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="key" fontSize={chartFontSize} interval={chartXAxisInterval} />
					<YAxis fontSize={chartFontSize} />
					<Legend wrapperStyle={{ marginLeft: chartLegendMarginLeft }} position={chartLegendPosition} />
					<Bar
						dataKey="playerOne"
						name="Player 1"
						fill={convertColor(DataCatcher.DARK_PURPLE_PADDLE_COLOR)}
						label={renderCustomBarLabel}
						isAnimationActive={false}
					/>
					<Bar
						dataKey="playerTwo"
						name="Player 2"
						fill={convertColor(DataCatcher.LIGHT_BLUE_PADDLE_COLOR)}
						label={renderCustomBarLabel}
						isAnimationActive={false}
					/>
				</BarChart>
			</ResponsiveContainer>
		</Box>
	);
};

type StyleVariant = {
	container: { mt: number; aspectRatio: number | Record<string, number> };
	title: { mb: number; ml: number; fontSize: number | Record<string, number | string> | string };
	chart: { fontSize: number; legendMarginLeft: string; legendPosition: string; xAxisInterval: number };
};

const styles: AdaptiveStyleEntry<StyleVariant>[] = [
	// Responsive (default)
	{
		styles: {
			container: {
				mt: 2,
				aspectRatio: { xs: 3, xl: 4 },
			},
			title: {
				mb: 2,
				ml: 6,
				fontSize: "20px",
			},
			chart: {
				fontSize: 16,
				legendMarginLeft: "40px",
				legendPosition: "bottom",
				xAxisInterval: 1,
			},
		},
	},
	// Landscape
	{
		query: ScreenSizes.landscape,
		styles: {
			title: {
				fontSize: { xs: "15px", lg: "18px", xl: "22px" },
			},
		},
	},
	// Landscape mobile
	{
		query: ScreenSizes.landscapeMobile,
		styles: {
			container: {
				mt: 0,
				aspectRatio: 4,
			},
			title: {
				mb: 0,
				ml: 0,
				fontSize: 12,
			},
			chart: {
				fontSize: 9,
				legendMarginLeft: "0px",
				legendPosition: "left",
			},
		},
	},
	// Landscape extra large, e.g. 1536 x 864, 1920 x 1080
	{
		query: ScreenSizes.landscapeXlWidth,
		styles: {
			chart: {
				xAxisInterval: 0,
			},
		},
	},
	// Portrait mobile
	{
		query: ScreenSizes.portraitMobile,
		styles: {
			chart: {
				xAxisInterval: 2,
			},
		},
	},
	// Portrait 1080p (1080x1920)
	{
		query: ScreenSizes.portrait1080p,
		styles: {
			chart: {
				xAxisInterval: 0,
			},
		},
	},
	// Portrait HD (1440+x2440+)
	{
		query: ScreenSizes.portraitHDOrLarger,
		styles: {
			chart: {
				xAxisInterval: 0,
			},
		},
	},
];
