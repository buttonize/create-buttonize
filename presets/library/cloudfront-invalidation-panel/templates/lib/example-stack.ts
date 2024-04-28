import * as cdk from 'aws-cdk-lib'
import { Distribution } from 'aws-cdk-lib/aws-cloudfront'
import { HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { Buttonize } from 'buttonize/cdk'
import { CloudFrontInvalidationPanel } from 'buttonize/library'
import { Construct } from 'constructs'

export class ExampleStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)

		Buttonize.init(this, {
			apiKey: '@@apiKey'
		})

		const yourDistribution = new Distribution(this, 'YourDistribution', {
			defaultBehavior: {
				origin: new HttpOrigin('google.com')
			}
		})

		new CloudFrontInvalidationPanel(this, 'CloudFrontPanel', {
			distribution: yourDistribution,
			paths: {
				All: '/*',
				Users: '/users',
				'Landing page': '/en/lp/mega-campaign'
			}
		})
	}
}
