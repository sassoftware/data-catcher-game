/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { DataCatcher } from "../constants";

export class GameHeader {
	scene!: Phaser.Scene;
	graphics!: Phaser.GameObjects.Graphics;
	scoreText!: Phaser.GameObjects.Text;
	timeText!: Phaser.GameObjects.Text;

	constructor(scene: Phaser.Scene, xOffset: number = 0, headerColor: number) {
		this.scene = scene;
		this.graphics = scene.add.graphics();
		this.graphics.setDepth(DataCatcher.DEPTH_TOOLBAR_BACKGROUND);
		// Player points circle
		this.graphics.fillStyle(headerColor, 1);
		this.graphics.fillCircle(
			xOffset + DataCatcher.GAME_HEADER_PADDING * 2 + DataCatcher.VERT_GAME_HEADER_HALF_WIDTH,
			DataCatcher.GAME_HEADER_PADDING * 2 + DataCatcher.VERT_GAME_HEADER_HALF_WIDTH,
			DataCatcher.VERT_GAME_HEADER_HALF_WIDTH
		);
		this.scoreText = scene.add
			.text(
				xOffset + DataCatcher.GAME_HEADER_PADDING * 2 + DataCatcher.VERT_GAME_HEADER_HALF_WIDTH,
				DataCatcher.GAME_HEADER_PADDING * 2 + DataCatcher.VERT_GAME_HEADER_HALF_WIDTH,
				"0",
				{
					fontSize: "24px",
					fontFamily: "Roboto",
					fontStyle: "300",
				}
			)
			.setDepth(DataCatcher.DEPTH_TOOLBAR_BACKGROUND + 1)
			.setColor("#ffffff")
			.setOrigin(0.5, 0.5);
	}

	update(score: number) {
		this.scoreText.setText(score.toFixed());
	}
}
