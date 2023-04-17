/**
 * @typedef {import("@typescript-eslint/utils").TSESLint.Linter.Config} LinterConfig
 * @typedef {import("eslint-import-resolver-typescript").TsResolverOptions} TsResolverOptions
 * @type { LinterConfig & { settings: { "import/resolver": { typescript: TsResolverOptions } } } }
 */
module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:import/recommended',
		'plugin:import/typescript',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: true
	},
	plugins: ['@typescript-eslint'],
	rules: {
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-floating-promises': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-unsafe-argument': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'import/order': [
			'warn',
			{
				groups: ['type', ['external', 'builtin'], ['internal', 'parent'], ['index', 'sibling'], 'object'],
				'newlines-between': 'always',
				alphabetize: {
					order: 'asc',
					orderImportKind: 'asc'
				}
			}
		],
		'sort-imports': ['warn', { ignoreDeclarationSort: true }]
	},
	settings: {
		'import/resolver': {
			typescript: true
		}
	},
	ignorePatterns: ['dist/', '**/*.js']
};
