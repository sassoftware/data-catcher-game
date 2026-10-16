/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

export namespace DataCatcher {
	export const WORLD_WIDTH = 450;
	export const WORLD_HEIGHT = 800;
	export const MULTIPLAYER_WORLD_WIDTH = 1500;
	export const WORLD_PADDING = 40;

	export const GAME_HEADER_HEIGHT = 56;
	export const GAME_HEADER_HALF_HEIGHT = GAME_HEADER_HEIGHT / 2;
	export const GAME_HEADER_PADDING = 16;
	export const VERT_GAME_HEADER_HALF_WIDTH = GAME_HEADER_HALF_HEIGHT;
	export const GAME_TIMER_HEIGHT = 25;
	export const GAME_TIMER_WIDTH = 450;
	export const GAME_TIMER_RADIUS = 10;
	export const GAME_OFFSCREEN_BUFFER = 5;

	export const BALL_RADIUS = 12;
	export const SQUARE_X = MULTIPLAYER_WORLD_WIDTH / 2;
	export const TRACK_END_Y = 685;
	export const TRACK_Y = 401;

	export const ROUND_TIME = 60;
	export const BASE_SPEED = 40;
	export const MAX_SPEED = 200;
	export const MAX_MULTIPLIER = 24;

	export const KEY_SPEED = 8;
	export const GAMEPAD_SPEED = 8;

	export const DEPTH_BALL = 10;
	export const DEPTH_SQUARE = 20;
	export const DEPTH_TOOLBAR_BACKGROUND = 100;
	export const DEPTH_BORDER = 1000;
	export const DEPTH_TRACKS = 15;
	export const DEPTH_TRACK_END = 20;

	export const LEFT_TRACK_START_X = 647;
	export const CENTER_LEFT_TRACK_START_X = 697;
	export const CENTER_TRACK_START_X = 750;
	export const CENTER_RIGHT_TRACK_START_X = 803;
	export const RIGHT_TRACK_START_X = 853;

	export const BLUE_COLOR = 0x0766d1;
	export const LIGHT_BLUE_COLOR = 0xb3d6ff;
	export const GRAY_COLOR = 0x928f8f;
	export const LIGHT_BLUE_PADDLE_COLOR = 0x00c8d3;
	export const DARK_PURPLE_PADDLE_COLOR = 0x440d84;

	export const TEXT_PADDING = 5;

	export enum Scene {
		GAME = "GameScene",
		SCORE = "ScoreScene",
		INSTRUCTIONS = "InstructionsScene",
	}

	export enum Events {
		GAME_OVER = "game-over",
	}

	export enum Assets {
		GAME_BALL_SHADOW = "game-ball-shadow",
		PINK_SQUARE = "pink-square",
		CATCHER = "catcher",
		EDGE = "edge",
		POINTER = "pointer",
		TRACKS = "funnel-track",
		DARK_PURPLE_PADDLE = "dark-purple-paddle",
		LIGHT_BLUE_PADDLE = "light-blue-paddle",
		TRACK_END = "circle",
		TIMER_PANEL = "timer-panel",
		BACKGROUND_MUSIC = "data-catcher-music",
		MUTE_ICON = "mute",
		UNMUTE_ICON = "unmute",
	}

	export enum Data {
		MOUSE_CONTROLS = "mouseControls",
		CAUGHT_1 = "caught1",
		CAUGHT_2 = "caught2",
		UNCAUGHT_1 = "uncaught1",
		UNCAUGHT_2 = "uncaught2",
		DOUBLE_POINTS_1 = "double1",
		DOUBLE_POINTS_2 = "double2",
		SINGLE_POINTS_1 = "single1",
		SINGLE_POINTS_2 = "single2",
		MUTE_MUSIC = "muteMusic",
		AUDIO_ENABLED = "audioEnabled",
	}

	export enum Ball {
		NORMAL,
		DOUBLEPOINTS,
		DEAD,
	}
}

export function convertColor(numberColor: number | undefined) {
	if (typeof numberColor === "undefined") {
		return "#000000";
	}
	return `#${numberColor.toString(16).padStart(6, "0")}`;
}

type AdjustTextOptions = {
	adjustX?: boolean;
	adjustY?: boolean;
	origX?: number;
	origY?: number;
};

export function adjustTextPosition(text: Phaser.GameObjects.Text, options?: AdjustTextOptions) {
	if (options) {
		if (options.adjustX || options.origX) {
			if (options.origX) {
				text.x = options.origX - Math.round(text.width / 2);
			} else {
				text.x -= Math.round(text.width / 2);
			}
		}
		if (options.adjustY || options.origY) {
			if (options.origY) {
				text.y = options.origY - Math.round(text.height / 2);
			} else {
				text.y -= Math.round(text.height / 2);
			}
		}
	} else {
		text.x -= Math.round(text.width / 2);
		text.y -= Math.round(text.height / 2);
	}
}
