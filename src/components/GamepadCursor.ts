/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import Phaser from "phaser";
import { DataCatcher } from "./constants";

export class GamepadCursor {
	initCursor: number;
	pressed: boolean = false;
	started: number | undefined;
	cursorSprite!: Phaser.GameObjects.Sprite;
	states: { x: number; y: number; callback?(): void; enter?(): void; leave?(): void; start?(): void }[] = [];
	lastAxes: [number, number] = [0, 0];
	activeNudge: (() => void) | undefined = () => {};

	constructor(
		public scene: Phaser.Scene,
		public cursor = 0,
		public active = true
	) {
		this.initCursor = this.cursor;
	}

	preload() {
		this.scene.load.image(
			DataCatcher.Assets.POINTER,
			`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/${DataCatcher.Assets.POINTER}.png`
		);
		this.states = [];
		this.cursor = this.initCursor;
	}

	// create the cursor sprite
	init() {
		if (!this.states[this.cursor]) {
			console.error("Current state is undefined, did you set the cursor wrong in the constructor?");
		}

		this.cursorSprite = this.scene.add
			.sprite(this.states[this.cursor].x, this.states[this.cursor].y, DataCatcher.Assets.POINTER)
			.setDepth(1000)
			.setOrigin(1, 0.5);

		this.scene.tweens.add({
			targets: this.cursorSprite,
			x: this.states[this.cursor].x - 8,
			y: this.states[this.cursor].y,
			duration: 1000,
			ease: "sine.inout",
			loop: -1,
			yoyo: true,
		});

		this.cursorSprite.setVisible(this.active);
		if (this.active) {
			this.states[this.cursor].enter?.();
		}
	}

	update() {
		const pads = this.scene.input.gamepad?.gamepads.filter((p) => p && p.connected) || [];
		if (pads.length === 0) return;

		const DEADZONE = 0.1;
		let axes: [number, number] = [0, 0];
		let pressed = false;

		// Combine input from all connected pads
		for (const pad of pads) {
			const x = Math.abs(pad.leftStick.x) > DEADZONE ? Math.round(pad.leftStick.x) : 0;
			const y = Math.abs(pad.leftStick.y) > DEADZONE ? Math.round(pad.leftStick.y) : 0;

			if (x !== 0 || y !== 0) {
				axes = [x, y];
			}

			if (pad.buttons[1].pressed || pad.buttons[2].pressed) {
				pressed = true;
			}
		}

		let state = this.states[this.cursor];

		if ((this.lastAxes[0] === 0 && axes[0] !== 0) || (this.lastAxes[1] === 0 && axes[1] !== 0)) {
			if (!this.active) {
				this.activeNudge?.();
			} else {
				const oldState = state;

				// find the state that's closest in the direction of the joystick
				const states = this.states
					.map((st, i) => {
						const d = [st.x - state.x, st.y - state.y];
						const dist = Math.sqrt(Math.pow(d[0], 2) + Math.pow(d[1], 2));
						for (const p of [0, 1]) {
							if (Math.abs(d[p]) > Math.abs(d[1 - p])) {
								d[p] = Math.sign(d[p]);
								d[1 - p] = 0;
							}
						}
						if (d[0] === d[1]) {
							d[1] = Math.sign(d[1]);
							d[0] = 0;
						}
						return { index: i, dist, d };
					})
					.filter((n) => n.index !== this.cursor && n.dist !== 0 && n.d[0] === axes[0] && n.d[1] === axes[1])
					// A different state
					.sort((a, b) => a.dist - b.dist);

				// the closest state in the direction
				const newIndex = states[0]?.index;
				if (newIndex !== undefined) {
					// a new state was actually found
					this.cursor = newIndex;
					state = this.states[this.cursor];
					this.scene.tweens.killTweensOf(this.cursorSprite);
					this.scene.tweens.chain({
						targets: this.cursorSprite,
						tweens: [
							{ x: state.x, y: state.y, duration: 100, ease: "sine.out" },
							{ x: state.x - 8, y: state.y, duration: 1000, ease: "sine.inout", loop: -1, yoyo: true },
						],
					});
					oldState.leave?.();
					state.enter?.();
				}
			}
		}

		this.lastAxes = axes;

		if (pressed && !this.pressed) {
			if (!this.active) {
				this.activeNudge?.();
			} else {
				state.start?.();
				this.started = this.cursor;
			}
		}
		if (!pressed && this.pressed && this.active) {
			if (this.cursor === this.started) {
				state.callback?.();
			}
			this.started = undefined;
		}
		this.pressed = pressed;
	}

	setActive(active: boolean) {
		if (this.active === active) {
			return;
		}

		if (this.active) {
			this.states[this.cursor].leave?.();
		} else {
			this.states[this.cursor].enter?.();
		}

		this.cursorSprite.setVisible(active);
		this.active = active;
	}

	setActiveNudge(nudge: (() => void) | undefined) {
		this.activeNudge = nudge;
	}
}
