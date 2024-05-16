import * as cdk from 'aws-cdk-lib'
import { Queue } from 'aws-cdk-lib/aws-sqs'
import { Buttonize, Input } from 'buttonize/cdk'
import { SqsQueueMessageForm } from 'buttonize/library'
import { Construct } from 'constructs'

export class ExampleStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)

		Buttonize.init(this, {
			apiKey: '@@apiKey'
		})

		const queue = new Queue(this, 'SqsQueue')

		new SqsQueueMessageForm(this, 'QueueMessageForm', {
			name: 'Product cache invalidation panel',
			description:
				'Trigger invalidation of a product in all the caches in the in the company systems',
			queue,
			submitButtonLabel: 'Invalidate',
			fields: [
				Input.text({
					id: 'id',
					label: 'Product ID'
				}),
				Input.select({
					id: 'reason',
					options: [
						{ label: 'New manual update', value: 'manual_update' },
						{ label: 'System bug', value: 'bug' }
					]
				})
			],
			messageAttributes: {
				operation: 'invalidate'
			},
			messagePayload: {
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
