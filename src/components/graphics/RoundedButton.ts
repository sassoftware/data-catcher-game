/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { DataCatcher, adjustTextPosition, convertColor } from "../constants";

type RoundedButtonOptions = {
	color?: number;
	backgroundColor?: number;
	padding?: number;
	paddingX?: number;
	paddingY?: number;
	fontSize?: string;
	fontFamily?: string;
	cornerRadius?: number;
	events?: { name: string; callback: () => void }[];
};

export default class RoundedButton {
	graphics!: Phaser.GameObjects.Graphics;

	constructor(scene: Phaser.Scene, x: number, y: number, buttonText: string, options: RoundedButtonOptions) {
		this.graphics = scene.add.graphics();

		const text = scene.add
			.text(x, y, buttonText, {
				fontSize: options.fontSize ?? "24px",
				fontFamily: options.fontFamily,
			})
			.setDepth(DataCatcher.DEPTH_TOOLBAR_BACKGROUND + 1)
			.setColor(convertColor(options.color));
		adjustTextPosition(text);

		const paddingX = options.paddingX ?? options.padding ?? 12;
		const paddingY = options.paddingY ?? options.padding ?? 12;
		const width = text.width + paddingX * 2;
		const height = text.height + paddingY * 2;
		const defaultRadius = width > height ? height / 2 : width / 2;

		this.graphics.fillStyle(options.backgroundColor ?? 0xffffff);
		this.graphics.fillRoundedRect(
			x - text.width / 2 - paddingX,
			y - text.height / 2 - paddingY,
			text.width + paddingX * 2,
			text.height + paddingY * 2,
			options.cornerRadius ?? defaultRadius
		);

		const clickable = scene.add
			.rectangle(x, y, text.width + paddingX * 2, text.height + paddingY * 2)
			.setInteractive({ useHandCursor: true });
		for (const event of options.events ?? []) {
			clickable.on(event.name, event.callback);
		}
	}
}
