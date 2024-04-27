import * as cdk from 'aws-cdk-lib'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Buttonize, Input } from 'buttonize/cdk'
import { LambdaInvocationForm } from 'buttonize/library'
import { Construct } from 'constructs'

export class ExampleStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)

		Buttonize.init(this, {
			apiKey: '@@apiKey'
		})

		const discountGenerator = new NodejsFunction(this, 'DiscountGenerator', {
			entry: 'src/discount-generator.ts'
		})

		new LambdaInvocationForm(this, 'DiscountGeneratorForm', {
			lambda: discountGenerator,
			name: 'Discount code generator',
			description: 'Generate discount for unhappy customers',
			fields: [
				Input.text({
					id: 'email',
					label: `Customer's email address`,
					placeholder: 'example@domain.com'
				}),
				Input.select({
					id: 'discount',
					label: 'Discount value',
					options: [
						{ label: '30%', value: 30 },
						{ label: '60%', value: 60 }
					]
				})
			],
			instructions: `Sometimes there is bug in our e-commerce system and we need to offer our customers a discount to keep them **happy**.

This tool generates a discount code for the customer and displays it on the following page.`
		})
	}
}
