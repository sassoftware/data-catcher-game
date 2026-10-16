/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import Phaser from "phaser";
import { DataCatcher } from "./constants";
import { GameScene } from "./scenes/GameScene";
import { InstructionsScene } from "./scenes/InstructionsScene";
import { ScoreScene } from "./scenes/ScoreScene";

export const DataCatcherConfig = {
	type: Phaser.AUTO,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: DataCatcher.WORLD_WIDTH,
		height: DataCatcher.WORLD_HEIGHT,
		parent: "phaser-game",
	},
	resolution: window.devicePixelRatio,
	physics: {
		default: "arcade",
		arcade: {
			fps: 300,
			gravity: { x: 0, y: 75 },
		},
	},
	input: {
		keyboard: true,
		gamepad: true,
	},
	transparent: true,
	scene: [InstructionsScene, GameScene, ScoreScene],
};
