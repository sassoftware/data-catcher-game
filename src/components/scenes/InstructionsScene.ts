/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { adjustTextPosition, convertColor, DataCatcher } from "components/constants";
import { GamepadCursor } from "components/GamepadCursor";
import RoundedButton from "components/graphics/RoundedButton";
import Phaser from "phaser";
import { Border } from "../graphics/Border";

export class InstructionsScene extends Phaser.Scene {
	cursor = new GamepadCursor(this, 0);

	constructor() {
		super({ key: DataCatcher.Scene.INSTRUCTIONS });
	}

	preload() {
		this.load.image(
			DataCatcher.Assets.GAME_BALL_SHADOW,
			`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/${DataCatcher.Assets.GAME_BALL_SHADOW}.png`
		);
		this.load.image(
			DataCatcher.Assets.DARK_PURPLE_PADDLE,
			`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/${DataCatcher.Assets.DARK_PURPLE_PADDLE}.png`
		);

		this.load.image(
			DataCatcher.Assets.LIGHT_BLUE_PADDLE,
			`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/${DataCatcher.Assets.LIGHT_BLUE_PADDLE}.png`
		);

		this.load.image(
			DataCatcher.Assets.UNMUTE_ICON,
			`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/${DataCatcher.Assets.UNMUTE_ICON}.png`
		);

		this.input.setDefaultCursor("default");
		this.cursor.preload();
		new Border(this);
	}

	create() {
		let currentY = 0;

		const contentArea = this.add.graphics();
		contentArea.fillStyle(0xffffff, 0.8);
		contentArea.fillRect(0, currentY, DataCatcher.WORLD_WIDTH, DataCatcher.WORLD_HEIGHT);
		contentArea.lineStyle(1, 0x0000ff);
		contentArea.strokeRect(0, currentY, DataCatcher.WORLD_WIDTH, DataCatcher.WORLD_HEIGHT);

		currentY = 100;

		adjustTextPosition(
			this.add.text(DataCatcher.WORLD_WIDTH / 2, currentY, "How to Play", {
				fontSize: "30px",
				color: convertColor(DataCatcher.BLUE_COLOR),
				align: "center",
				fontFamily: "Roboto",
				fontStyle: "700",
			})
		);

		currentY += 110;

		const graphics = this.add.graphics();
		graphics.fillStyle(0xffffff, 0.8);
		graphics.fillRect(
			DataCatcher.GAME_HEADER_PADDING,
			currentY,
			DataCatcher.WORLD_WIDTH - DataCatcher.GAME_HEADER_PADDING * 2,
			380
		);
		graphics.lineStyle(1, DataCatcher.BLUE_COLOR);
		graphics.strokeRect(
			DataCatcher.GAME_HEADER_PADDING + 0.5, // + 0.5 aligns the line to the pixel grid and stops antialiasing
			currentY + 0.5,
			DataCatcher.WORLD_WIDTH - DataCatcher.GAME_HEADER_PADDING * 2,
			380
		);

		currentY += 40;
		const baseX = 80;

		const ball = this.physics.add.sprite(baseX, currentY, DataCatcher.Assets.GAME_BALL_SHADOW);
		ball.body.setAllowGravity(false);
		const textOptions = {
			fontSize: "16px",
			color: "black",
			fontFamily: "Roboto",
			fontStyle: "500",
			padding: { y: DataCatcher.TEXT_PADDING, x: 0 },
		};
		adjustTextPosition(
			this.add.text(
				baseX + 50,
				currentY,
				`Catch as many data points\nas you can in ${DataCatcher.ROUND_TIME} seconds.`,
				textOptions
			),
			{ adjustY: true }
		);

		currentY += 80;

		const square = this.physics.add.sprite(baseX, currentY, DataCatcher.Assets.DARK_PURPLE_PADDLE);
		square.body.setAllowGravity(false);
		adjustTextPosition(
			this.add.text(
				baseX + 50,
				currentY,
				`Use the left game controller or the \nkeys W and S to move this catcher.`,
				textOptions
			),
			{ adjustY: true }
		);

		currentY += 90;

		const square2 = this.physics.add.sprite(baseX, currentY, DataCatcher.Assets.LIGHT_BLUE_PADDLE);
		square2.body.setAllowGravity(false);
		adjustTextPosition(
			this.add.text(
				baseX + 50,
				currentY,
				`Use the right game controller or the \nkeys ↑ and ↓ to move this catcher.`,
				textOptions
			),
			{ adjustY: true }
		);

		currentY += 70;

		const blueBall = this.physics.add.sprite(baseX, currentY, DataCatcher.Assets.GAME_BALL_SHADOW);
		blueBall.body.setAllowGravity(false);
		blueBall.setTint(DataCatcher.LIGHT_BLUE_COLOR);
		adjustTextPosition(
			this.add.text(baseX + 50, currentY, `Catch the blue data points to\nreceive double points!`, textOptions),
			{ adjustY: true }
		);

		currentY += 60;

		const speakerIcon = this.physics.add.sprite(baseX, currentY, DataCatcher.Assets.UNMUTE_ICON);
		speakerIcon.body.setAllowGravity(false);
		speakerIcon.setDisplaySize(35, 35);
		adjustTextPosition(
			this.add.text(
				baseX + 50,
				currentY,
				`Press the mute button or the M key\nto turn background music on or off.`,
				textOptions
			),
			{ adjustY: true }
		);
		currentY += 140;

		new RoundedButton(this, DataCatcher.WORLD_WIDTH / 2, currentY, "Play", {
			backgroundColor: DataCatcher.BLUE_COLOR,
			color: 0xffffff,
			fontFamily: "Roboto",
			fontSize: "20px",
			paddingX: 50,
			paddingY: 16,
			events: [
				{
					name: "pointerdown",
					callback: () => {
						this.game.registry.set(DataCatcher.Data.MOUSE_CONTROLS, true);
						this.cursor.setActive(true);
						this.scene.start(DataCatcher.Scene.GAME);
					},
				},
			],
		});
		this.cursor.states.push({
			x: DataCatcher.WORLD_WIDTH / 2 - 64,
			y: currentY,
			callback: () => {
				this.scene.start(DataCatcher.Scene.GAME);
			},
		});

		this.cursor.init();
		this.cursor.setActive(!this.game.registry.get(DataCatcher.Data.MOUSE_CONTROLS));
		this.cursor.setActiveNudge(() => {
			this.game.registry.set(DataCatcher.Data.MOUSE_CONTROLS, false);
			this.cursor.setActive(true);
		});
	}

	update() {
		this.cursor.update();
	}
}
