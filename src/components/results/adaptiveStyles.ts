/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SxProps } from "@mui/material";
import { useEffect, useState } from "react";

type PathsOf<T> = {
	[K in keyof T & string]: T[K] extends object ? (string extends keyof T[K] ? K : `${K}.${PathsOf<T[K]>}`) : K;
}[keyof T & string];

type DeepPartial<T> =
	T extends Array<infer U> ? Array<DeepPartial<U>> : T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

export type AdaptiveStyleEntry<T extends object> =
	{ styles: DeepPartial<T> } | { query: string; styles: DeepPartial<T> };

function getValueAtPath(obj: unknown, path: string): unknown {
	return path.split(".").reduce((o: unknown, key) => {
		if ((typeof o !== "object" && typeof o !== "function") || o === null) {
			return undefined;
		}

		return (o as Record<string, unknown>)[key];
	}, obj);
}

export function getAdaptiveStyles<T extends object>(
	entries: AdaptiveStyleEntry<T>[],
	mapping: Record<string, PathsOf<T>>
): SxProps {
	const result: Record<string, unknown> = {};

	for (const entry of entries) {
		const mapped: Record<string, unknown> = {};
		for (const [cssProp, path] of Object.entries(mapping)) {
			const value = getValueAtPath(entry.styles, path);
			if (value !== undefined) {
				mapped[cssProp] = value;
			}
		}

		if ("query" in entry) {
			result[entry.query] = mapped;
		} else {
			Object.assign(result, mapped);
		}
	}

	return result;
}

/**
 * Strips the leading "@media " prefix (if present) so the query can be passed to `window.matchMedia`.
 */
function toMatchMediaQuery(query: string): string {
	return query.replace(/^@media\s*/, "");
}

/**
 * Resolves a single, non-sx value (e.g. a numeric prop like QRCode's `size`) from an adaptive styles
 * entry list, re-evaluating it whenever the matching media query changes.
 *
 * Unlike `getAdaptiveStyles`, which produces an `SxProps` object that the browser evaluates via CSS
 * media queries, this hook evaluates the queries in JavaScript (via `window.matchMedia`) so the
 * resolved value can be passed directly to component props that don't accept responsive CSS.
 *
 * Entries are evaluated in order, with later matching entries overriding earlier ones - mirroring the
 * cascade behavior of `getAdaptiveStyles`. On the server (or before the component mounts), only the
 * default (non-query) entry is used to avoid hydration mismatches.
 */
export function useAdaptiveValue<T extends object, V = unknown>(
	entries: AdaptiveStyleEntry<T>[],
	path: PathsOf<T>
): V | undefined {
	const resolve = (useMatchMedia: boolean): V | undefined => {
		let current: V | undefined;

		for (const entry of entries) {
			const matches =
				!("query" in entry) ||
				(useMatchMedia && typeof window !== "undefined" && window.matchMedia(toMatchMediaQuery(entry.query)).matches);

			if (matches) {
				const value = getValueAtPath(entry.styles, path);
				if (value !== undefined) current = value as V;
			}
		}

		return current;
	};

	const [value, setValue] = useState<V | undefined>(() => resolve(false));

	useEffect(() => {
		const mediaQueryLists = entries
			.filter((entry): entry is Extract<AdaptiveStyleEntry<T>, { query: string }> => "query" in entry)
			.map((entry) => window.matchMedia(toMatchMediaQuery(entry.query)));

		const update = () => setValue(resolve(true));

		mediaQueryLists.forEach((mql) => mql.addEventListener("change", update));
		update();

		return () => {
			mediaQueryLists.forEach((mql) => mql.removeEventListener("change", update));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return value;
}
