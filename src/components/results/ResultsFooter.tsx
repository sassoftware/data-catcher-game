/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box } from "@mui/material";
import { GamepadCursorComponent } from "components/GamepadCursorComponent";
import { Link } from "components/results/Link";
import { LoadingIndicator } from "components/results/LoadingIndicator";
import { useRetakeButtonGamepadCursor } from "components/useGamepadCursor";
import { useSearchParams } from "next/navigation";

/**
 * This checks if value is a string and if the trimmed string has a length greater than 0.
 * @param value optional string
 * @returns true if the trimmed string has a length greater than 0, false otherwise
 */
function hasLength(value: string | undefined | null): value is string {
	if (typeof value === "string" && value.trim().length > 0) {
		return true;
	}
	return false;
}

export const ResultsFooter = () => {
	const queryParams = useSearchParams();

	const { retakeButtonRef, gamepadCursorState, gamepadCursorStates } = useRetakeButtonGamepadCursor(
		queryParams?.get("gamepad") === "true"
	);

	const restartText = "Play again";

	const queryString = hasLength(queryParams?.toString()) ? `?${queryParams?.toString()}` : "";
	const restartHref = `datacatcher${queryString}`;

	return (
		<Box
			sx={{
				mt: { xs: 0, s: 1 },
				display: "flex",
				flexDirection: "row",
				justifyContent: "space-between",
				alignItems: "center",
			}}
		>
			<Box>
				<LoadingIndicator size="1rem">
					<Link
						href={`/${restartHref}`}
						underline="hover"
						data-qa="retake-quiz-link"
						ref={retakeButtonRef}
						color="primary.dark"
					>
						{restartText}
					</Link>
				</LoadingIndicator>
			</Box>
			{gamepadCursorState !== undefined && (
				<GamepadCursorComponent states={gamepadCursorStates} state={gamepadCursorState} side="right" />
			)}
		</Box>
	);
};
