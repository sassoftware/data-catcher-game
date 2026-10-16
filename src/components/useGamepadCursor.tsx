/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { GamepadCursorExtendedState, gamepadLogic } from "./GamepadCursorComponent";

export function useRetakeButtonGamepadCursor(defaultGamepadOn = false) {
	const retakeButtonRef = useRef<HTMLAnchorElement>(null);

	const { gamepadCursorState, gamepadCursorStates } = useGamepadCursor(
		[
			{
				ref: retakeButtonRef,
				next: [
					// dimension, sign
					[null, null], // left, right
					[null, null], // up, down
				],
				callback() {
					retakeButtonRef.current?.click();
				},
			},
		],
		defaultGamepadOn
	);

	return { retakeButtonRef, gamepadCursorState, gamepadCursorStates };
}

export function useGamepadCursor(refs: GamepadCursorExtendedState[], defaultGamepadOn = false) {
	const gamepadCursorStates: GamepadCursorExtendedState[] = useMemo(() => refs, [refs]);
	const gamepadCursorStatesRef = useRef<GamepadCursorExtendedState[]>(gamepadCursorStates);
	useEffect(() => {
		gamepadCursorStatesRef.current = gamepadCursorStates;
	}, [gamepadCursorStates]);

	const [gamepadCursorState, setGamepadCursorState] = useState<number | undefined>(defaultGamepadOn ? 0 : undefined);
	const gamepadCursorStateRef = useRef<number | undefined>(gamepadCursorState);
	useEffect(() => {
		gamepadCursorStateRef.current = gamepadCursorState;
	}, [gamepadCursorState]);

	useEffect(() => {
		if (defaultGamepadOn) {
			return gamepadLogic(gamepadCursorStatesRef, gamepadCursorStateRef, setGamepadCursorState);
		}
	}, [defaultGamepadOn]);

	return { gamepadCursorState, gamepadCursorStates };
}
