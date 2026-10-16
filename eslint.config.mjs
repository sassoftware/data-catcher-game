/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import { defineConfig } from "eslint/config";

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	prettier,
	{
		rules: {
			"@next/next/no-html-link-for-pages": "off",
			"@typescript-eslint/no-unused-vars": ["error", { varsIgnorePattern: "^_|Struct$", ignoreRestSiblings: true }],
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/no-empty-interface": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-namespace": "off",
			"prefer-const": "error",
			"react/no-unescaped-entities": "off",
			"react/jsx-curly-brace-presence": ["error", { props: "never", children: "never", propElementValues: "always" }],
			"no-fallthrough": "error",
		},
	},
]);

export default eslintConfig;
