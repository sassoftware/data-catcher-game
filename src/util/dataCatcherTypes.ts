/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

export type DataCatcherSettings = {
	defaultGamepadOn?: boolean; // if true, gamepad controls should be activated at the beginning(e.g. for arcade cabinet)
	hideYourHighestScore?: boolean; //if true, don't show local high score (e.g. for arcade cabinet)

	// cursor settings - used both in the game and results pages
	cursorUrl?: string; // what image the cursor should use (ex: "/images/pointer.png")
	cursorOffset?: number[]; // where the pointing part of the cursor is - a sensible default is [1, 0.5], halfway down the right side of the image

	audioEnabled?: boolean;
};

export type PlayerScores = {
	playerOne: {
		score: number;
		caughtBalls: number;
		uncaughtBalls: number;
		doublePoints: number;
		singlePoints: number;
	};
	playerTwo: {
		score: number;
		caughtBalls: number;
		uncaughtBalls: number;
		doublePoints: number;
		singlePoints: number;
	};
};
