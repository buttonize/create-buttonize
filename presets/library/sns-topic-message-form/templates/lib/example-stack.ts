import * as cdk from 'aws-cdk-lib'
import { Topic } from 'aws-cdk-lib/aws-sns'
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions'
import { Buttonize, Input } from 'buttonize/cdk'
import { SnsTopicMessageForm } from 'buttonize/library'
import { Construct } from 'constructs'

export class ExampleStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)

		Buttonize.init(this, {
			apiKey: '@@apiKey'
		})

		const topic = new Topic(this, 'SnsTopic')

		new SnsTopicMessageForm(this, 'TopicMessageForm', {
			name: 'Product cache invalidation panel',
			description:
				'Trigger invalidation of a product in all the caches in the in the company systems',
			topic,
			submitButtonLabel: 'Invalidate',
			fields: [
				Input.text({
					id: 'id',
					label: 'Product ID'
				}),
				Input.select({
					id: 'reason',
					options: [
						{
							label: 'New manual update',
							value: 'manual_update'
						},
						{
							label: 'System bug',
							value: 'bug'
						}
					]
				})
			],
			messagePayload: {
				operation: 'invalidate',
				product: {
					pid: '{{id}}'
				},
				metadata: {
					reasonStatement: '{{reason.value}}'
				}
			}
		})

		topic.addSubscription(new EmailSubscription('your-email@example.com'))
	}
}
