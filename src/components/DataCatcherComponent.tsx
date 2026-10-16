/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box } from "@mui/material";
import { GameContext } from "context/GameContext";
import { useRouter } from "next/router";
import Phaser from "phaser";
import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { DataCatcherSettings, PlayerScores } from "util/dataCatcherTypes";
import { HeadWithMeta } from "./HeadWithMeta";
import { DataCatcherConfig } from "./config";
import { DataCatcher } from "./constants";

let phaserAdded = false;

type DataCatcherComponentProps = {
	host: string | null;
};

export default function DataCatcherComponent({ host }: DataCatcherComponentProps) {
	const router = useRouter();
	const phaserGame = useRef<Phaser.Game>();
	const { setScore } = useContext(GameContext);

	const dcSettings: DataCatcherSettings = useMemo(() => {
		return {
			cursorOffset: [1, 0.5],
			audioEnabled: true,
		};
	}, []);

	const gamepadControls = useRef(dcSettings.defaultGamepadOn || router.query.gamepad === "true");
	const audioEnabled = useRef<boolean>(dcSettings.audioEnabled ?? false);

	const submitScore = useCallback(
		async (
			score1: number,
			score2: number,
			caught1: number,
			caught2: number,
			uncaught1: number,
			uncaught2: number,
			doublePoints1: number,
			doublePoints2: number,
			singlePoints1: number,
			singlePoints2: number
		) => {
			const payload: PlayerScores = {
				playerOne: {
					score: score1,
					caughtBalls: caught1,
					uncaughtBalls: uncaught1,
					doublePoints: doublePoints1,
					singlePoints: singlePoints1,
				},
				playerTwo: {
					score: score2,
					caughtBalls: caught2,
					uncaughtBalls: uncaught2,
					doublePoints: doublePoints2,
					singlePoints: singlePoints2,
				},
			};
			setScore(payload);

			await router.push(`/datacatcher/results?gamepad=${gamepadControls.current}`);
		},
		[router, setScore]
	);

	useEffect(() => {
		let phaserInstance: Phaser.Game | undefined = undefined;
		if (!phaserAdded) {
			phaserInstance = new Phaser.Game({
				...DataCatcherConfig,
				callbacks: {
					preBoot: (game) => {
						game.registry.merge({
							[DataCatcher.Data.MOUSE_CONTROLS]: !gamepadControls.current,
							[DataCatcher.Data.AUDIO_ENABLED]: audioEnabled.current,
						});
					},
				},
			});
			phaserGame.current = phaserInstance;
			phaserAdded = true;
			phaserInstance.events.on(
				DataCatcher.Events.GAME_OVER,
				(
					score1: number,
					score2: number,
					caught1: number,
					caught2: number,
					uncaught1: number,
					uncaught2: number,
					double1: number,
					double2: number,
					single1: number,
					single2: number
				) => {
					const usedGamepad = !phaserInstance!.registry.get(DataCatcher.Data.MOUSE_CONTROLS);
					caught1 = phaserInstance!.registry.get(DataCatcher.Data.CAUGHT_1);
					caught2 = phaserInstance!.registry.get(DataCatcher.Data.CAUGHT_2);
					uncaught1 = phaserInstance!.registry.get(DataCatcher.Data.UNCAUGHT_1);
					uncaught2 = phaserInstance!.registry.get(DataCatcher.Data.UNCAUGHT_2);
					double1 = phaserInstance!.registry.get(DataCatcher.Data.DOUBLE_POINTS_1);
					double2 = phaserInstance!.registry.get(DataCatcher.Data.DOUBLE_POINTS_2);
					single1 = phaserInstance!.registry.get(DataCatcher.Data.SINGLE_POINTS_1);
					single2 = phaserInstance!.registry.get(DataCatcher.Data.SINGLE_POINTS_2);

					gamepadControls.current = usedGamepad;

					submitScore(score1, score2, caught1, caught2, uncaught1, uncaught2, double1, double2, single1, single2);
				}
			);
		}
		return () => {
			if (phaserInstance) {
				phaserInstance.destroy(true);
				phaserAdded = false;
			}
		};
	}, [submitScore, dcSettings, router]);

	return (
		<Box display="flex" alignItems="center" justifyContent="center" height="100%" px={2} py={3}>
			<HeadWithMeta host={host} title="Data Catcher" />
			<Box id="phaser-game" maxHeight="800px" maxWidth="1500px"></Box>
			<style jsx global>{`
				/* Other global styles such as 'html, body' etc... */
				#__next {
					height: 100%;
				}
			`}</style>
		</Box>
	);
}
