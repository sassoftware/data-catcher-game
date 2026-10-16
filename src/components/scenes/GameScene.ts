/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import Phaser from "phaser";
import { DataCatcher } from "../constants";
import { Border } from "../graphics/Border";
import { GameHeader } from "../graphics/GameHeader";
import { Player } from "../graphics/Player";
import { TimerBar } from "../graphics/TimerBar";

export class GameScene extends Phaser.Scene {
	player1!: Player;
	player2!: Player;
	speed = DataCatcher.BASE_SPEED;
	score1 = 0;
	score2 = 0;
	remainingSeconds = DataCatcher.ROUND_TIME;
	partialBalls = 0;
	caughtBalls1 = 0;
	caughtBalls2 = 0;
	uncaughtBalls1 = 0;
	uncaughtBalls2 = 0;
	doublePoints1 = 0;
	doublePoints2 = 0;
	singlePoints1 = 0;
	singlePoints2 = 0;

	keys: { [key: string]: Phaser.Input.Keyboard.Key } = {};

	header!: GameHeader;
	header2!: GameHeader;
	timer!: TimerBar;

	balls!: Phaser.Physics.Arcade.Group;

	enableParticles = true;
	music!: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
	prevMutePressed = false;
	speaker!: Phaser.GameObjects.Image;
	speakerLabel!: Phaser.GameObjects.Text;

	constructor() {
		super({ key: DataCatcher.Scene.GAME });
	}

	preload() {
		this.load.image(
			DataCatcher.Assets.TRACKS,
			`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/${DataCatcher.Assets.TRACKS}.png`
		);

		this.load.image(
			DataCatcher.Assets.TRACK_END,
			`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/${DataCatcher.Assets.TRACK_END}.png`
		);

		this.load.image(
			DataCatcher.Assets.TIMER_PANEL,
			`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/${DataCatcher.Assets.TIMER_PANEL}.png`
		);

		this.load.audio(
			DataCatcher.Assets.BACKGROUND_MUSIC,
			`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/audio/${DataCatcher.Assets.BACKGROUND_MUSIC}.ogg`
		);

		this.load.image(
			DataCatcher.Assets.MUTE_ICON,
			`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/${DataCatcher.Assets.MUTE_ICON}.png`
		);

		this.load.image(
			DataCatcher.Assets.UNMUTE_ICON,
			`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/${DataCatcher.Assets.UNMUTE_ICON}.png`
		);

		const edge = this.add.graphics({ fillStyle: { color: 0xff7700 } });
		edge.fillRect(0, 0, 1, 1);
		edge.generateTexture(DataCatcher.Assets.EDGE, 1, 1);
		edge.destroy();

		const catcher = this.add.graphics({ fillStyle: { color: 0x00ff00 } });
		catcher.fillRect(0, 0, 1, 1);
		catcher.generateTexture(DataCatcher.Assets.CATCHER, 1, 1);
		catcher.destroy();

		this.input.setDefaultCursor("none");
		this.scale.setGameSize(DataCatcher.MULTIPLAYER_WORLD_WIDTH, DataCatcher.WORLD_HEIGHT);

		new Border(this);
	}

	private getRandomY = (): number => {
		// Randomize ball drop placement on each side
		return Phaser.Math.Between(DataCatcher.WORLD_PADDING * 3, DataCatcher.WORLD_HEIGHT - DataCatcher.WORLD_PADDING * 2);
	};

	private addBall = () => {
		// Balls spawn at the same time but location is randomized
		this.spawnBall(true, this.getRandomY()); // Left side
		this.spawnBall(false, this.getRandomY()); // Right side
	};

	private spawnBall = (isLeft: boolean, y: number) => {
		// Determines which side the ball spawns in, and which direction to start moving
		const x = isLeft
			? DataCatcher.BALL_RADIUS + 1
			: DataCatcher.MULTIPLAYER_WORLD_WIDTH - (DataCatcher.BALL_RADIUS + 1);
		const velocityX = isLeft
			? Phaser.Math.Between(Math.round(this.speed * 2), Math.round(this.speed * 2.5))
			: -Phaser.Math.Between(Math.round(this.speed * 2), Math.round(this.speed * 2.5));

		let ball: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody = this.balls.getFirstDead(
			false,
			x,
			y,
			DataCatcher.Assets.GAME_BALL_SHADOW
		);

		if (!ball) {
			ball = this.balls.get(x, y, DataCatcher.Assets.GAME_BALL_SHADOW);
			if (!ball) return;
			ball.setDepth(DataCatcher.DEPTH_BALL);
		}

		// Initialize custom ball data
		(ball as any).state = DataCatcher.Ball.NORMAL;
		(ball as any).origin = isLeft ? "playerOneSide" : "playerTwoSide";

		ball.clearTint();
		ball.enableBody(true, x, y).setVelocity(velocityX, 0).setActive(true).setVisible(true);
		ball.body.setAllowGravity(false);
		ball.body.setCircle(
			DataCatcher.BALL_RADIUS,
			ball.width / 2 - DataCatcher.BALL_RADIUS,
			ball.height / 2 - DataCatcher.BALL_RADIUS
		);
		ball.body.setBounce(0);
		ball.body.setCollideWorldBounds(false);
	};

	create() {
		this.speed = DataCatcher.BASE_SPEED;
		this.remainingSeconds = DataCatcher.ROUND_TIME;
		this.partialBalls = 0;
		this.physics.world.setBounds(0, 0, DataCatcher.MULTIPLAYER_WORLD_WIDTH, DataCatcher.WORLD_HEIGHT, true, true);

		if (this.registry.get(DataCatcher.Data.AUDIO_ENABLED)) {
			this.music = this.sound.add(DataCatcher.Assets.BACKGROUND_MUSIC, {
				loop: false,
				volume: 0.4,
			});
			this.music.setMute(this.registry.get(DataCatcher.Data.MUTE_MUSIC) ?? false);
			this.music.play();
		}

		this.keys = this.input.keyboard!.addKeys(
			{
				w: Phaser.Input.Keyboard.KeyCodes.W,
				s: Phaser.Input.Keyboard.KeyCodes.S,
				up: Phaser.Input.Keyboard.KeyCodes.UP,
				down: Phaser.Input.Keyboard.KeyCodes.DOWN,
				m: Phaser.Input.Keyboard.KeyCodes.M,
			},
			true
		) as { [key: string]: Phaser.Input.Keyboard.Key };

		this.player1 = new Player(
			this,
			DataCatcher.SQUARE_X - 170,
			DataCatcher.WORLD_HEIGHT / 2,
			DataCatcher.Assets.DARK_PURPLE_PADDLE,
			this.keys.w,
			this.keys.s
		);
		this.player2 = new Player(
			this,
			DataCatcher.SQUARE_X + 170,
			DataCatcher.WORLD_HEIGHT / 2,
			DataCatcher.Assets.LIGHT_BLUE_PADDLE,
			this.keys.up,
			this.keys.down
		);

		this.cameras.main.setBackgroundColor(0xf1f2f4);

		this.balls = this.physics.add.group();

		const tracks = this.add.image(
			DataCatcher.MULTIPLAYER_WORLD_WIDTH / 2,
			DataCatcher.TRACK_Y,
			DataCatcher.Assets.TRACKS
		);
		tracks.displayHeight = DataCatcher.WORLD_HEIGHT;
		tracks.displayWidth = 300;
		tracks.setDepth(DataCatcher.DEPTH_TRACKS);

		const trackEnd = this.physics.add.staticImage(
			DataCatcher.MULTIPLAYER_WORLD_WIDTH / 2,
			DataCatcher.TRACK_END_Y,
			DataCatcher.Assets.TRACK_END
		);
		trackEnd.setScale(0.6);
		trackEnd.setDepth(DataCatcher.DEPTH_TRACK_END);
		const trackEndGlow = trackEnd.enableFilters().filters!.internal.addGlow(0x666666, 0, 0, 1, false, 0.1, 24);

		const ballHitCatcher = (cube: any, ball: any) => {
			this.balls.killAndHide(ball);
			ball.disableBody(true, false);

			// Handles which player caught the ball
			if (cube === this.player1.playerSprite) {
				this.caughtBalls1++;
				if (ball.state === DataCatcher.Ball.DOUBLEPOINTS) {
					this.doublePoints1++;
					this.score1 += 2;
				} else {
					this.singlePoints1++;
					this.score1 += 1;
				}
			} else if (cube === this.player2.playerSprite) {
				this.caughtBalls2++;
				if (ball.state === DataCatcher.Ball.DOUBLEPOINTS) {
					this.doublePoints2++;
					this.score2 += 2;
				} else {
					this.singlePoints2++;
					this.score2 += 1;
				}
			}
			ballDownTrack(cube);
		};

		const ballDownTrack = (catcher: any) => {
			const randomTrack = Math.floor(Math.random() * 5) + 1;
			// Uses 5 to ensure all paths get equal balls
			let randomPath = centerPath;
			let randomStart = DataCatcher.CENTER_TRACK_START_X;
			if (catcher == this.player1.playerSprite) {
				switch (randomTrack) {
					case 1:
					case 2:
						randomPath = leftPath;
						randomStart = DataCatcher.LEFT_TRACK_START_X;
						break;
					case 3:
					case 4:
						randomPath = centerLeftPath;
						randomStart = DataCatcher.CENTER_LEFT_TRACK_START_X;
						break;
				}
			} else if (catcher == this.player2.playerSprite) {
				switch (randomTrack) {
					case 1:
					case 2:
						randomPath = rightPath;
						randomStart = DataCatcher.RIGHT_TRACK_START_X;
						break;
					case 3:
					case 4:
						randomPath = centerRightPath;
						randomStart = DataCatcher.CENTER_RIGHT_TRACK_START_X;
						break;
				}
			}

			// Send white ball down the randomly chosen track
			const follower = this.add.follower(randomPath, randomStart, 0, DataCatcher.Assets.GAME_BALL_SHADOW);
			follower.setDepth(17);
			follower.startFollow({
				duration: 1500,
				onComplete: () => {
					follower.destroy();
					trackEndGlow.innerStrength = 0;
					trackEndGlow.outerStrength = 0;
					this.tweens.add({
						targets: trackEndGlow,
						outerStrength: 2,
						innerStrength: 2,
						yoyo: true,
						loop: 0,
						ease: "sine.inout",
						duration: 200,
					});
				},
			});
		};

		const leftPath = this.add.path(DataCatcher.LEFT_TRACK_START_X, 0);
		leftPath.add(
			new Phaser.Curves.CubicBezier(
				new Phaser.Math.Vector2(DataCatcher.LEFT_TRACK_START_X, 0),
				new Phaser.Math.Vector2(DataCatcher.LEFT_TRACK_START_X + 75, 50),
				new Phaser.Math.Vector2(DataCatcher.CENTER_TRACK_START_X, 165),
				new Phaser.Math.Vector2(DataCatcher.CENTER_TRACK_START_X, 210)
			)
		);
		leftPath.lineTo(DataCatcher.CENTER_TRACK_START_X, DataCatcher.TRACK_END_Y);

		const centerLeftPath = this.add.path(DataCatcher.CENTER_LEFT_TRACK_START_X, 0);
		centerLeftPath.add(
			new Phaser.Curves.CubicBezier(
				new Phaser.Math.Vector2(DataCatcher.CENTER_LEFT_TRACK_START_X, 0),
				new Phaser.Math.Vector2(DataCatcher.CENTER_LEFT_TRACK_START_X + 20, 40),
				new Phaser.Math.Vector2(DataCatcher.CENTER_TRACK_START_X, 70),
				new Phaser.Math.Vector2(DataCatcher.CENTER_TRACK_START_X, 80)
			)
		);
		centerLeftPath.lineTo(DataCatcher.CENTER_TRACK_START_X, DataCatcher.TRACK_END_Y);

		const centerPath = this.add.path(DataCatcher.CENTER_TRACK_START_X, 0);
		centerPath.lineTo(DataCatcher.CENTER_TRACK_START_X, DataCatcher.TRACK_END_Y);

		const centerRightPath = this.add.path(DataCatcher.CENTER_RIGHT_TRACK_START_X, 0);
		centerRightPath.add(
			new Phaser.Curves.CubicBezier(
				new Phaser.Math.Vector2(DataCatcher.CENTER_RIGHT_TRACK_START_X, 0),
				new Phaser.Math.Vector2(DataCatcher.CENTER_RIGHT_TRACK_START_X - 20, 40),
				new Phaser.Math.Vector2(DataCatcher.CENTER_TRACK_START_X + 10, 70),
				new Phaser.Math.Vector2(DataCatcher.CENTER_TRACK_START_X, 80)
			)
		);
		centerRightPath.lineTo(DataCatcher.CENTER_TRACK_START_X, DataCatcher.TRACK_END_Y);

		const rightPath = this.add.path(DataCatcher.RIGHT_TRACK_START_X, 0);
		rightPath.add(
			new Phaser.Curves.CubicBezier(
				new Phaser.Math.Vector2(DataCatcher.RIGHT_TRACK_START_X, 0),
				new Phaser.Math.Vector2(DataCatcher.RIGHT_TRACK_START_X - 75, 50),
				new Phaser.Math.Vector2(DataCatcher.CENTER_TRACK_START_X, 165),
				new Phaser.Math.Vector2(DataCatcher.CENTER_TRACK_START_X, 220)
			)
		);
		rightPath.lineTo(DataCatcher.CENTER_TRACK_START_X, DataCatcher.TRACK_END_Y);

		this.physics.add.collider(this.balls, this.player1.playerSprite, ballHitCatcher);
		this.physics.add.collider(this.balls, this.player2.playerSprite, ballHitCatcher);

		this.header = new GameHeader(this, 0, DataCatcher.DARK_PURPLE_PADDLE_COLOR);
		this.header2 = new GameHeader(
			this,
			DataCatcher.MULTIPLAYER_WORLD_WIDTH - DataCatcher.WORLD_PADDING * 3,
			DataCatcher.LIGHT_BLUE_PADDLE_COLOR
		);
		this.timer = new TimerBar(
			this,
			DataCatcher.MULTIPLAYER_WORLD_WIDTH / 2 - DataCatcher.GAME_TIMER_WIDTH / 2,
			DataCatcher.WORLD_HEIGHT - DataCatcher.WORLD_PADDING
		);
	}

	update(time: number, delta: number) {
		const centerX = DataCatcher.MULTIPLAYER_WORLD_WIDTH / 2;

		const pad1 = this.input.gamepad?.pad1;
		const pad2 = this.input.gamepad?.pad2;

		const mutePressed =
			(pad1?.buttons[3]?.pressed ?? false) || (pad2?.buttons[3]?.pressed ?? false) || this.keys.m.isDown;

		if (this.registry.get(DataCatcher.Data.AUDIO_ENABLED)) {
			if (mutePressed && !this.prevMutePressed) {
				const newMute = !this.music.mute;
				this.music.setMute(newMute);
				this.registry.set(DataCatcher.Data.MUTE_MUSIC, newMute);
			}

			const isMuted = !!this.registry.get(DataCatcher.Data.MUTE_MUSIC);
			const muteIcon = isMuted ? DataCatcher.Assets.MUTE_ICON : DataCatcher.Assets.UNMUTE_ICON;

			if (!this.speaker || !this.speaker.scene) {
				this.speaker = this.add.image(
					DataCatcher.MULTIPLAYER_WORLD_WIDTH - DataCatcher.WORLD_PADDING + 10,
					DataCatcher.WORLD_HEIGHT - DataCatcher.WORLD_PADDING + 14,
					muteIcon
				);
				this.speaker.setDepth(20);
				this.speaker.setDisplaySize(28, 28);

				this.speakerLabel = this.add.text(this.speaker.x - 28, this.speaker.y - 7, "M", {
					fontSize: "12px",
					color: "#0766d1", // blue
					fontFamily: "Roboto",
					fontStyle: "700", // bold for legibility
					align: "center",
				});
				this.speakerLabel.setDepth(21);
			} else {
				if (this.speaker.texture.key !== muteIcon) {
					this.speaker.setTexture(muteIcon);
				}
			}
		}

		this.prevMutePressed = mutePressed;

		this.balls.getChildren().forEach((ball: any) => {
			if (!ball.active) return;

			const isLeftSide = ball.x < centerX;
			const crossedToOpposite =
				(ball.origin === "playerOneSide" && !isLeftSide) || (ball.origin === "playerTwoSide" && isLeftSide);

			// Ball crosses to other side: turns blue
			if (ball.state === DataCatcher.Ball.NORMAL && crossedToOpposite) {
				// Uncaught by original player
				if (ball.origin === "playerOneSide") {
					this.uncaughtBalls1++;
				} else if (ball.origin === "playerTwoSide") {
					this.uncaughtBalls2++;
				}

				ball.setTint(DataCatcher.LIGHT_BLUE_COLOR);
				ball.state = DataCatcher.Ball.DOUBLEPOINTS;
			}

			// Ball disappears after turning blue and going off either side of the game window
			else if (
				ball.state === DataCatcher.Ball.DOUBLEPOINTS &&
				(ball.x > DataCatcher.MULTIPLAYER_WORLD_WIDTH + DataCatcher.GAME_OFFSCREEN_BUFFER ||
					ball.x < -DataCatcher.GAME_OFFSCREEN_BUFFER)
			) {
				if (ball.origin === "playerOneSide") {
					this.uncaughtBalls2++; // Player 2 missed
				} else if (ball.origin === "playerTwoSide") {
					this.uncaughtBalls1++; // Player 1 missed
				}

				ball.disableBody(true, true);
				ball.state = DataCatcher.Ball.DEAD;
			}
		});

		if (this.remainingSeconds > 0) {
			this.remainingSeconds -= delta / 1000;

			// Increase the speed linearly throughout the game.
			this.speed =
				DataCatcher.BASE_SPEED +
				(1 - this.remainingSeconds / DataCatcher.ROUND_TIME) * (DataCatcher.MAX_SPEED - DataCatcher.BASE_SPEED);

			// Increase the multiplier exponentially throughout the round from 1 to MAX_MULTIPLIER
			const ballsPerSecond = Math.floor(
				Math.pow(
					1 * (1 + (DataCatcher.MAX_MULTIPLIER - 1)),
					(DataCatcher.ROUND_TIME - this.remainingSeconds) / DataCatcher.ROUND_TIME
				)
			);

			this.header.update(this.score1);
			this.header2.update(this.score2);
			this.timer.update(this.remainingSeconds);

			const ballsPerCall = ballsPerSecond * (delta / 1000) * 0.5; // Multiplied by 0.5 to reduce initial spawn rate
			const totalBallsThisCall = ballsPerCall + this.partialBalls;
			const roundBallsPerCall = Math.floor(totalBallsThisCall);
			this.partialBalls = totalBallsThisCall - roundBallsPerCall;

			for (let i = 0; i < roundBallsPerCall; i++) {
				this.addBall();
			}

			// Gamepad 1 (left USB port); Gamepad 2 (right USB port)
			this.player1.move(delta, this.input.gamepad?.pad1);
			this.player2.move(delta, this.input.gamepad?.pad2);

			this.player1.clampPosition();
			this.player2.clampPosition();
		} else {
			// Save gameplay data to registry before ending scene
			this.registry.set(DataCatcher.Data.CAUGHT_1, this.caughtBalls1);
			this.registry.set(DataCatcher.Data.CAUGHT_2, this.caughtBalls2);
			this.registry.set(DataCatcher.Data.UNCAUGHT_1, this.uncaughtBalls1);
			this.registry.set(DataCatcher.Data.UNCAUGHT_2, this.uncaughtBalls2);
			this.registry.set(DataCatcher.Data.DOUBLE_POINTS_1, this.doublePoints1);
			this.registry.set(DataCatcher.Data.DOUBLE_POINTS_2, this.doublePoints2);
			this.registry.set(DataCatcher.Data.SINGLE_POINTS_1, this.singlePoints1);
			this.registry.set(DataCatcher.Data.SINGLE_POINTS_2, this.singlePoints2);

			this.scene.start(DataCatcher.Scene.SCORE, { score1: this.score1, score2: this.score2 });
		}
	}
}
