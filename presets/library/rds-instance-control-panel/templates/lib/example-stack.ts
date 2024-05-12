import * as cdk from 'aws-cdk-lib'
import {
	InstanceClass,
	InstanceSize,
	InstanceType,
	SubnetType,
	Vpc
} from 'aws-cdk-lib/aws-ec2'
import { DatabaseInstance, DatabaseInstanceEngine } from 'aws-cdk-lib/aws-rds'
import { Buttonize } from 'buttonize/cdk'
import { RDSInstanceControlPanel } from 'buttonize/library'
import { Construct } from 'constructs'

export class ExampleStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)

		Buttonize.init(this, {
			apiKey: '@@apiKey'
		})

		const defaultVpc = Vpc.fromLookup(this, 'VPC', { isDefault: true })

		const instance = new DatabaseInstance(this, 'RdsInstance', {
			engine: DatabaseInstanceEngine.POSTGRES,
			vpc: defaultVpc,
			instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.MICRO),
			instanceIdentifier: 'my-little-test-buttonize-db',
			vpcSubnets: {
				subnetType: SubnetType.PUBLIC // Publicly accessible instance
			}
		})

		new RDSInstanceControlPanel(this, 'ControlPanel', {
			instance
		})
	}
}
