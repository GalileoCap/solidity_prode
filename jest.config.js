module.exports = {
	rootDir: 'src',
	testEnvironment: 'jsdom',
	setupFiles: ['../jest.envSetup.js'], //U: para definir globales como fetch
	transform: {
		"\\.[jt]sx?$":  [ 'esbuild-jest', { 
			loaders: {
				'.spec.js': 'jsx',
				'.js': 'jsx'
			}
		}
		]
	},
	testPathIgnorePatterns: ['/node_modules/', '/dist/', '/types/' ],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
}
