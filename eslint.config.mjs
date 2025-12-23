import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ files: ["*/.{js,mjs,cjs,ts}"] },
	{ languageOptions: { globals: globals.browser } },
	{
		rules: {
			"@typescript-eslint/no-unused-vars": [
				"error",
				{ argsIgnorePattern: "^_" },
			],
			"no-unused-vars": "error",
			"prefer-const": "error",
			"@typescript-eslint/no-inferrable-types": "warn",
		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ["src/types/express.d.ts"],
		rules: {
			"@typescript-eslint/no-unused-vars": "off",
			"no-unused-vars": "off",
			"no-undef": "off",
		},
	},
];
