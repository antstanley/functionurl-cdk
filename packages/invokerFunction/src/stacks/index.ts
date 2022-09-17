import { App, Stack, StackProps } from 'aws-cdk-lib'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Runtime, FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda'
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam'
import { join } from 'path'

class AppStack extends Stack {
  public readonly url: string
  constructor (scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    const functionPath = join(
      __dirname,
      '..',
      '..',
      'functions',
      'invokerFunction',
      'index.ts'
    )

    const invokerFunction = new NodejsFunction(this, 'invokerFunction', {
      runtime: Runtime.NODEJS_16_X,
      memorySize: 1024,
      logRetention: 1,
      handler: 'handler',
      entry: functionPath,
      functionName: `${id}-invokerFunction`,
      awsSdkConnectionReuse: true,
      bundling: {
        target: 'es2020'
      }
    })

    const functionUrl = invokerFunction.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE
    })

    this.url = functionUrl.url
  }
}

const app = new App()

new AppStack(app, 'invokerStack', {})
