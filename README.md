# DBeat serverless API

This is a serverless API made for portfolio reasons using AWS Cloud Development Kit. The cloud development kit, or just CDK, is tool that allows easy deployment of AWS infrastructure as code, internally transforming the code into AWS CloudFormation templates.

The application main file to understand this API logic is `lib/dblunch-serverless-api-stack.ts`. It calls all the other files.

## Setup

To run CDK commands you need to have it installed in your machine. You also need your AWS credentials adjusted locally. You can check the get started CDK guide https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html.

-   `npm install -g aws-cdk` install CDK globaly

## Environment Variables

Necessary variables
Specify the name of the environment that will be builded using the `cdk deploy` or `yarn deploy` commands.

-   `ENVIRONMENT=DEVELOPMENT|STAGING|PRODUCTION`

## Lambda layers

For Lambda functions to use `node_modules` it needs to have the code injected, it behaves differently from non-serverless Node based applications where you just need to import the module. This is one of the uses of Lambda Layers, it allows the reuse of code between Lambdas. Any `node_module` that is not default from AWS should be imported manually.

In the deployment, each Lambda layer must have it's own `package.json` build, otherwise the Lambdas won't find the modules. Is also important that it keeps the `my_layer/nodejs` folder structure, otherwise AWS won't be able to read the layer.

## App Credentials

After seeding the default credential is:

-   `email` test@email.com
-   `password` test123

## Useful commands

-   `yarn deploy` fast deploy the stack to the default AWS account/region.
-   `yarn lint:fix` quick lint fixing.
-   `yarn prettier:fix` quick prettier fixing.
-   `npm run build` compile typescript to js.
-   `npm run watch` watch for changes and compile.
-   `npm run test` perform the jest unit tests.
-   `cdk deploy` deploy this stack to your default AWS account/region.
-   `cdk diff` compare deployed stack with current state.
-   `cdk synth` emits the synthesized CloudFormation template.
-   `cdk destroy` remove from AWS all the stack elements.

## Seeding and DB

You can seed the DynamoDB table calling the `/seed` endpoint with a `POST` method. This endpoint is not exposed on de `PRODUCTION` environment.

The table removal policy behaves diferently when on `PRODUCTION` environment. `RETAIN` on production and `DESTROY` on other environments. You can check it on https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_core.RemovalPolicy.html

## Linting

This project uses `ESLint` for static code analysis.
`Prettier` is configured to format the code according to `ESLint` rules.

Below commands help to resolve some conflicts automatically:

```
yarn prettier:fix
yarn lint:fix
```

## Todo's

There is unfinished things on this project, here is some of them and also some sugestions.

# Business rules

-   decide business logic related to vote draw.
-   finish the "disable restaurant voted in the week" functionality.
-   maybe add sns/socket to send push notification
-   implement add restaurant functionality

# Infrastructure

-   add integration tests.
-   finish authentication with Cognito.
-   use api gateway route validation instead of Lambda proxy integration.
-   implement CI/CD.
-   add time limit and billing controll specifications.

# Codequality

-   separate TypeScript build form files.
-   centralize the logic into Lambda layers for reusing purposes.

# Fix

-   improve code by adding more abstraction layers(dependency inversion).
-   fix typescript any types to proper types
-   fix bugs regarding timezones.
