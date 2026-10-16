/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { DataCatcher } from "../constants";

export class TimerBar {
	scene!: Phaser.Scene;
	graphics!: Phaser.GameObjects.Graphics;
	blueBar!: Phaser.GameObjects.Graphics;
	scoreText!: Phaser.GameObjects.Text;
	timeText!: Phaser.GameObjects.Text;
	xOffset!: number;
	yOffset!: number;
	timerPanel!: Phaser.GameObjects.Image;

	constructor(scene: Phaser.Scene, xOffset: number = 0, yOffset: number = 0) {
		this.xOffset = xOffset;
		this.yOffset = yOffset;
		this.scene = scene;

		// Timer border image
		this.timerPanel = scene.add.image(
			xOffset + DataCatcher.GAME_TIMER_WIDTH / 2,
			yOffset + DataCatcher.GAME_TIMER_HEIGHT / 2,
			DataCatcher.Assets.TIMER_PANEL
		);
		this.timerPanel.setDepth(DataCatcher.DEPTH_TOOLBAR_BACKGROUND);
		this.timerPanel.setDisplaySize(DataCatcher.GAME_TIMER_WIDTH + 15, DataCatcher.GAME_TIMER_HEIGHT * 2 - 10);

		// Timer depleting bar
		this.blueBar = scene.add.graphics();
		this.blueBar.setDepth(DataCatcher.DEPTH_TOOLBAR_BACKGROUND + 1);
		this.blueBar.fillStyle(DataCatcher.BLUE_COLOR);
		this.blueBar.fillRoundedRect(
			xOffset,
			yOffset,
			DataCatcher.GAME_TIMER_WIDTH,
			DataCatcher.GAME_TIMER_HEIGHT,
			DataCatcher.GAME_TIMER_RADIUS
		);

		this.timeText = scene.add
			.text(
				xOffset + DataCatcher.GAME_TIMER_WIDTH / 2,
				yOffset + DataCatcher.GAME_TIMER_HEIGHT / 2,
				`${DataCatcher.ROUND_TIME}s`,
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

	update(remainingSeconds: number) {
		this.timeText.setText(`${Math.ceil(remainingSeconds)}s`);
		if (remainingSeconds < DataCatcher.ROUND_TIME * 0.1) {
			this.timeText.setColor("#f24949");
		} else if (remainingSeconds < DataCatcher.ROUND_TIME * 0.2) {
			this.timeText.setColor("#ffcc33");
		}

		const newRadius =
			remainingSeconds < DataCatcher.ROUND_TIME * 0.05
				? (DataCatcher.GAME_TIMER_WIDTH * (remainingSeconds / DataCatcher.ROUND_TIME)) / 2
				: DataCatcher.GAME_TIMER_RADIUS;

		this.blueBar.clear();
		this.blueBar.fillStyle(DataCatcher.BLUE_COLOR);
		this.blueBar.fillRoundedRect(
			this.xOffset +
				DataCatcher.GAME_TIMER_WIDTH / 2 -
				(DataCatcher.GAME_TIMER_WIDTH * (remainingSeconds / DataCatcher.ROUND_TIME)) / 2,
			this.yOffset,
			DataCatcher.GAME_TIMER_WIDTH * (remainingSeconds / DataCatcher.ROUND_TIME),
			DataCatcher.GAME_TIMER_HEIGHT,
			newRadius
		);
	}
}
