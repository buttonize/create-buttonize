import * as cdk from 'aws-cdk-lib'
import { Pass, StateMachine } from 'aws-cdk-lib/aws-stepfunctions'
import { Buttonize, Input } from 'buttonize/cdk'
import { StepFunctionsExecutionForm } from 'buttonize/library'
import { Construct } from 'constructs'

export class ExampleStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)

		Buttonize.init(this, {
			apiKey: '@@apiKey'
		})

		const stateMachine = new StateMachine(this, 'StateMachine', {
			definition: new Pass(this, 'PassTest')
		})

		new StepFunctionsExecutionForm(this, 'ExecutionForm', {
			name: 'Product cache invalidation panel',
			description:
				'Trigger invalidation of a product in all the caches in the in the company systems',
			stateMachine,
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
			executionInput: {
				operation: 'invalidate',
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
