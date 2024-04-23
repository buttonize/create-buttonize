import * as cdk from 'aws-cdk-lib'
import {
	AmazonLinuxImage,
	Instance,
	InstanceClass,
	InstanceSize,
	InstanceType,
	Vpc
} from 'aws-cdk-lib/aws-ec2'
import { Buttonize } from 'buttonize/cdk'
import { EC2InstanceControlPanel } from 'buttonize/library'
import { Construct } from 'constructs'

export class ExampleStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)

		Buttonize.init(this, {
			apiKey: '@@apiKey'
		})

		const defaultVpc = Vpc.fromLookup(this, 'VPC', { isDefault: true })

		const ec2Instance = new Instance(this, 'ec2Instance', {
			instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
			machineImage: new AmazonLinuxImage(),
			vpc: defaultVpc
		})

		new EC2InstanceControlPanel(this, 'ControlPanel', {
			instance: ec2Instance
		})
	}
}
