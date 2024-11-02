import { Duration, Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
// import lambda construct
import * as lambda from "aws-cdk-lib/aws-lambda";
// import api gateway construct
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export class CdkAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // hello world lambda
    const helloWorldLambda = new lambda.Function(this, "hello-world", {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "hello-world.handler",
      timeout: Duration.seconds(30),
    });

    // output the lambda arn to console
    new CfnOutput(this, "hello-world-lambda-name", {
      value: helloWorldLambda.functionName,
    });

    // API Gateway
    const api = new apigateway.RestApi(this, "hello-world-api", {
      restApiName: "Hello World API",
    });

    // output the api endpoint to console
    new CfnOutput(this, "hello-world-api-endpoint", {
      value: api.url,
      description: "API Gateway endpoint URL",
    });

    // GET /hello route
    api.root
      .addResource("hello")
      .addMethod("GET", new apigateway.LambdaIntegration(helloWorldLambda));
  }
}
