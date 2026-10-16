/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import Phaser from "phaser";
import { DataCatcher, adjustTextPosition, convertColor } from "../constants";

export class ScoreScene extends Phaser.Scene {
	score1 = 0;
	score2 = 0;
	winner = "";

	constructor() {
		super({ key: DataCatcher.Scene.SCORE });
	}

	init(data: any) {
		this.score1 = data.score1;
		this.score2 = data.score2;
		if (this.score1 > this.score2) {
			this.winner = "Player 1";
		} else if (this.score1 < this.score2) {
			this.winner = "Player 2";
		} else {
			this.winner = "It's a Tie!";
		}
	}

	preload() {
		this.input.setDefaultCursor("default");
	}

	create() {
		let currentY = 210;

		const centerX = DataCatcher.MULTIPLAYER_WORLD_WIDTH / 2;
		const offsetX = 200;
		const contentAreaWidth = 600;
		const contentAreaHeight = 400;

		const contentArea = this.add.graphics();
		contentArea.fillStyle(0xffffff, 0.8);
		contentArea.fillRect(centerX - contentAreaWidth / 2, currentY, contentAreaWidth, contentAreaHeight);
		contentArea.lineStyle(1, 0x0000ff);
		contentArea.strokeRect(centerX - contentAreaWidth / 2, currentY, contentAreaWidth, contentAreaHeight);

		currentY += 110;

		adjustTextPosition(
			this.add.text(centerX - 100, currentY, `Winner:`, {
				fontSize: "50px",
				color: "black",
				fontFamily: "Roboto",
				fontStyle: "400",
			})
		);

		adjustTextPosition(
			this.add.text(centerX + 100, currentY, this.winner, {
				fontSize: "50px",
				color: "#000000",
				fontFamily: "Roboto",
				fontStyle: "700",
			})
		);

		currentY += 100;

		adjustTextPosition(
			this.add.text(centerX - offsetX, currentY, `Player 1:`, {
				fontSize: "24px",
				color: "black",
				fontFamily: "Roboto",
				fontStyle: "700",
			})
		);

		adjustTextPosition(
			this.add.text(centerX + offsetX, currentY, `Player 2:`, {
				fontSize: "24px",
				color: "black",
				fontFamily: "Roboto",
				fontStyle: "700",
			})
		);

		currentY += 60;

		adjustTextPosition(
			this.add.text(centerX - offsetX, currentY, `${this.score1}`, {
				fontSize: "96px",
				color: convertColor(DataCatcher.DARK_PURPLE_PADDLE_COLOR),
				fontFamily: "Roboto",
				fontStyle: "700",
			})
		);

		adjustTextPosition(
			this.add.text(centerX + offsetX, currentY, `${this.score2}`, {
				fontSize: "96px",
				color: convertColor(DataCatcher.LIGHT_BLUE_PADDLE_COLOR),
				fontFamily: "Roboto",
				fontStyle: "700",
			})
		);

		setTimeout(() => {
			this.game.events.emit(DataCatcher.Events.GAME_OVER, this.score1, this.score2);
		}, 3000);
	}
}
