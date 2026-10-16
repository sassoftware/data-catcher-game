/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import Phaser from "phaser";
import { DataCatcher } from "../constants";

export class Player {
	playerSprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	image: string;
	keyUp: Phaser.Input.Keyboard.Key;
	keyDown: Phaser.Input.Keyboard.Key;
	x: number;
	y: number;
	gamepadHeld: number = 0;
	keyHeld: number = 0;

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		image: string,
		keyUp: Phaser.Input.Keyboard.Key,
		keyDown: Phaser.Input.Keyboard.Key
	) {
		this.playerSprite = scene.physics.add.sprite(x, y, image);
		this.keyUp = keyUp;
		this.keyDown = keyDown;
		this.x = x;
		this.y = y;
		this.image = image;

		// Have to turn off some physics to hold in place
		this.playerSprite.body.setAllowGravity(false);
		this.playerSprite.body.setAllowDrag(false);
		this.playerSprite.body.setImmovable(true);
		this.playerSprite.body.setSize(15, 76);
		this.playerSprite.body.setOffset(0, 0.5);
		this.playerSprite.setDepth(DataCatcher.DEPTH_SQUARE);
	}

	move(delta: number, gamepad?: Phaser.Input.Gamepad.Gamepad | null) {
		// Keypad

		const keyboardMovement = +(+this.keyDown.isDown) + -+this.keyUp.isDown;

		const accelerationAmt = Math.min(this.keyHeld / 250, 1);
		const acc = 0.25 + accelerationAmt * 0.75;

		this.playerSprite.y += ((keyboardMovement * DataCatcher.KEY_SPEED * delta) / 16) * acc;

		if (Math.abs(keyboardMovement) > 0.1) {
			this.keyHeld += delta;
		} else {
			this.keyHeld = 0;
		}

		// Gamepad
		if (gamepad && keyboardMovement == 0) {
			const gamepadStick = Math.round(gamepad.leftStick.y);
			const gamepadButton = -gamepad.buttons[0].value + gamepad.buttons[1].value;
			const gamepadMovement = gamepadStick !== 0 ? gamepadStick : gamepadButton;

			const acc = 0.25 + Math.min(this.gamepadHeld / 250, 1) * 0.75;

			if (gamepadMovement !== 0) {
				this.playerSprite.y += ((gamepadMovement * DataCatcher.GAMEPAD_SPEED * delta) / 16) * acc;
			}

			if (Math.abs(gamepadStick) > 0.1 || gamepadButton !== 0) {
				this.gamepadHeld += delta;
			} else {
				this.gamepadHeld = 0;
			}
		}
	}

	clampPosition() {
		this.playerSprite.y = Phaser.Math.Clamp(
			this.playerSprite.y,
			DataCatcher.WORLD_PADDING * 3,
			DataCatcher.WORLD_HEIGHT - DataCatcher.WORLD_PADDING * 2
		);
	}
}
