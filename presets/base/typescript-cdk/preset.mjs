import { extract, install } from '../../../src/index.js'

export default [
	extract(),
	install({
		packages: [
			'@types/node@20',
			'aws-cdk',
			'ts-node',
			'typescript',
			'buttonize'
		],
		dev: true
	}),
	install({
		packages: ['source-map-support', 'constructs@^10.0.0', 'aws-cdk-lib']
	})
]
