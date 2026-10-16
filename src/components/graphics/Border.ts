/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import Phaser from "phaser";
import { DataCatcher } from "../constants";

export class Border extends Phaser.GameObjects.Graphics {
	constructor(scene: Phaser.Scene) {
		super(scene, { lineStyle: { width: 2, color: DataCatcher.GRAY_COLOR } });
		scene.add.existing(this);
		this.setDepth(DataCatcher.DEPTH_BORDER);
		this.strokeRect(0, 0, scene.scale.width, scene.scale.height);
	}
}
