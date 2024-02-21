import * as cdk from 'aws-cdk-lib'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Action, Buttonize, ButtonizeApp, Display, Input } from 'buttonize/cdk'
import { Construct } from 'constructs'
import * as path from 'path'

export class ExampleStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)

		Buttonize.init(this, {
			apiKey: 'btnz_mybuttonizekey1234567',
			externalId: 'CHANGE-ME-some-random-external-id'
		})

		const discountGenerator = new NodejsFunction(this, 'DiscountGenerator', {
			entry: path.join(__dirname, '../', 'discountGenerator.ts')
		})

		new ButtonizeApp(this, 'DemoApp', {
			name: 'Discount code generator',
			description:
				'Select the discount amount and you will get the discount code on the next page.'
		})
			.page('InputPage', {
				body: [
					Display.heading('Generate discount code for customer'),
					Input.select({
						id: 'discount',
						label: 'Discount value',
						options: [
							{ label: '30%', value: 30 },
							{ label: '60%', value: 60 }
						]
					}),
					Display.button({
						label: 'Generate discount',
						onClick: Action.aws.lambda.invoke(
							discountGenerator,
							{ Payload: { discountValue: '{{discount}}' } },
							{ id: 'discountGenerator' }
						),
						onClickFinished: Action.buttonize.app.changePage('DonePage')
					})
				]
			})
			.page('DonePage', {
				body: [
					Display.heading('Discount generated'),
					Display.text('Discount code: {{InputPage.discountGenerator.code}}')
				]
			})
	}
}
