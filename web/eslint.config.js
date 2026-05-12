import js from '@eslint/js';
import {defineConfig} from 'eslint/config';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default defineConfig(
	js.configs.recommended,
	tseslint.configs.strict,
	reactHooks.configs.flat.recommended,
	reactRefresh.configs.vite,
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			globals: globals.browser,
		},
	},
	{
		ignores: ['dist', 'public/dotnet/'],
	},
);
