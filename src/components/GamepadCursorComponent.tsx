/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { MutableRefObject, RefObject, useLayoutEffect, useMemo, useRef, useState } from "react";
import { DataCatcherSettings } from "util/dataCatcherTypes";
import { DataCatcher } from "./constants";

type GamepadCursorComponentProps = {
	states: { ref: MutableRefObject<HTMLElement | null> }[];
	state: number;
	active?: boolean;
	cursorUrl?: string;
	cursorOffset?: number[];
	side: "left" | "right";
};

export type GamepadCursorExtendedState = {
	ref: RefObject<HTMLElement | null>;
	next: (number | null)[][];
	callback?(): void;
};

export function gamepadLogic(
	gamepadCursorStatesRef: RefObject<GamepadCursorExtendedState[]>,
	gamepadCursorStateRef: MutableRefObject<number | undefined>,
	setGamepadCursorState: (v: number | undefined) => void
) {
	const dirTimers = [0, 0]; // How long each direction has been held for
	let lastPressed = false;
	let cancelled = false;
	let lastTime = 0;

	function frame(time: number) {
		const delta = time - lastTime;
		lastTime = time;

		const gamepads = navigator.getGamepads?.() ?? [];

		const directional = [0, 0]; // how long each direction has been held for
		let pressed = false;

		// Merge input from all connected gamepads
		for (const pad of gamepads) {
			if (!pad || !pad.connected) continue;

			directional[0] += pad.axes[0] ?? 0;
			directional[1] += pad.axes[1] ?? 0;
			if (pad.buttons[1]?.pressed || pad.buttons[2]?.pressed) {
				pressed = true;
			}
		}

		// Normalize directional input
		for (let i = 0; i < 2; i++) {
			if (Math.abs(directional[i]) < 0.5) {
				// deadzones
				directional[i] = 0;
			}
			if (directional[i] === 0) {
				// letting go of the direction
				dirTimers[i] = 0;
			} else if (
				dirTimers[i] === 0 || // Starting to hold
				Math.sign(directional[i]) === Math.sign(dirTimers[i]) // Keeping it held
			) {
				dirTimers[i] += Math.sign(directional[i]) * delta;
			}
		}

		const released = !pressed && lastPressed;
		lastPressed = pressed;

		const state =
			gamepadCursorStateRef.current !== undefined
				? gamepadCursorStatesRef.current?.[gamepadCursorStateRef.current]
				: undefined;

		if (state) {
			for (const dimension of [0, 1]) {
				for (const sign of [-1, 1]) {
					// if this direction is being pressed, find out if the cursor should move
					if (dirTimers[dimension] === delta * sign && delta !== 0) {
						const n = state.next[dimension][+(sign === 1)];
						if (n !== null) {
							setGamepadCursorState((gamepadCursorStateRef.current = n));
						}
					}
				}
			}

			// call the callback for the state on button press
			if (released) {
				state.callback?.();
			}
		} else {
			// on any directional input, set the cursor to the first entry
			if (dirTimers[0] !== 0 || dirTimers[1] !== 0) {
				setGamepadCursorState((gamepadCursorStateRef.current = 0));
			}
		}

		if (!cancelled) {
			// call every frame
			requestAnimationFrame(frame);
		}
	}

	requestAnimationFrame(frame);

	return () => {
		cancelled = true;
	};
}

export const GamepadCursorComponent = ({ states, state, side = "left" }: GamepadCursorComponentProps) => {
	const dcSettings = useMemo(() => {
		return {} as DataCatcherSettings;
	}, []);

	return (
		<BaseGamepadCursorComponent
			states={states}
			state={state}
			side={side}
			cursorUrl={dcSettings.cursorUrl}
			cursorOffset={dcSettings.cursorOffset}
		/>
	);
};

export const BaseGamepadCursorComponent = ({
	states,
	state,
	side = "left",
	cursorUrl = `/images/${DataCatcher.Assets.POINTER}.png`,
	cursorOffset = [1, 0.5],
}: GamepadCursorComponentProps) => {
	const cursorRef = useRef<HTMLDivElement | null>(null);
	const [imageLoaded, setImageLoaded] = useState(false);
	const [positioned, setPositioned] = useState(false);

	useLayoutEffect(() => {
		const currentCursorTarget = states[state]?.ref.current;
		const imageReady = imageLoaded || (cursorRef.current?.querySelector("img")?.width ?? 0) > 0;
		if (cursorRef.current && currentCursorTarget && imageReady) {
			const rect = currentCursorTarget.getBoundingClientRect();
			const img = cursorRef.current.querySelector("img")!;
			cursorRef.current.style.top = rect.top + rect.height / 2 - img.height * cursorOffset[1] + "px";
			cursorRef.current.style.left =
				side === "left"
					? rect.left - (img.width * cursorOffset[0] + 3) + "px"
					: rect.right + (img.width * (1 - cursorOffset[0]) + 10) + "px";
			setPositioned(true);
		}
	}, [state, states, imageLoaded, cursorOffset, side]);

	return (
		<>
			<style jsx>{`
				@keyframes gamepad-cursor {
					from {
						transform: translateX(0);
					}
					to {
						transform: translateX(-8px);
					}
				}

				.gamepad-cursor {
					animation: gamepad-cursor 1s ease-in-out infinite alternate;
					position: fixed;
					opacity: ${positioned ? 1 : 0};
					transition:
						left 0.1s ease-out,
						top 0.1s ease-out;
					z-index: 9999;
				}
			`}</style>
			<div className="gamepad-cursor" ref={cursorRef}>
				{/* eslint-disable-next-line @next/next/no-img-element*/}
				<img
					alt=""
					src={(process.env.NEXT_PUBLIC_BASE_PATH ?? "") + cursorUrl}
					style={side === "right" ? { transform: "rotate(180deg)" } : undefined}
					onLoad={() => {
						setImageLoaded(true);
					}}
				/>
			</div>
		</>
	);
};
