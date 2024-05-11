import * as cdk from 'aws-cdk-lib'
import { UserPool } from 'aws-cdk-lib/aws-cognito'
import { Buttonize } from 'buttonize/cdk'
import { CognitoManagementPanel } from 'buttonize/library'
import { Construct } from 'constructs'

export class ExampleStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)

		Buttonize.init(this, {
			apiKey: '@@apiKey'
		})

		const userPool = new UserPool(this, 'UserPool', {
			signInAliases: {
				email: true
			}
		})

		new CognitoManagementPanel(this, 'CognitoPanel', {
			userPool
		})
	}
}
