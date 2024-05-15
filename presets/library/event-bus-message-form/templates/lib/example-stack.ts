import * as cdk from 'aws-cdk-lib'
import { Buttonize, Input } from 'buttonize/cdk'
import { EventBusMessageForm } from 'buttonize/library'
import { Construct } from 'constructs'

export class ExampleStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)

		Buttonize.init(this, {
			apiKey: '@@apiKey'
		})

		new EventBusMessageForm(this, 'EventBusMessageForm', {
			name: 'Product cache invalidation panel',
			description:
				'Trigger invalidation of a product in all the caches in the in the company systems',
			submitButtonLabel: 'Invalidate',

			fields: [
				Input.text({
					id: 'id',
					label: 'Product ID'
				}),
				Input.select({
					id: 'reason',
					label: 'Reason',
					options: [
						{ label: 'New manual update', value: 'manual_update' },
						{ label: 'System bug', value: 'bug' }
					]
				})
			],

			source: 'product-service',
			detailType: 'create-invalidation',

			detail: {
				product: {
					pid: '{{id}}'
				},
				metadata: {
					reasonStatement: '{{reason.value}}'
				}
			}
		})
	}
}
