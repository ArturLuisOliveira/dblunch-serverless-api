# DBeat serverless api

This is an serverless api demo project using AWS Cloud Development Kit, made for portfolio reasons. CDK allows to easilly deploy AWS infrastructure as code, transforming the code into a AWS CloudFormation templates.

The application main file is `lib/dblunch-serverless-api-stack.ts`.

## .ENV

Necessary variables
Specify the name of the enviroment that will be builded using the `cdk` commands.

-   `ENVIRONMENT=DEVELOPMENT|STAGING|PRODUCTION`

## Credentials

Credential for access after seeding.

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

You can seed your DynamoDB table calling the `/seed` endpoint. This endpoint is not exposed on de production environment.

The table removal policy behaves diferently when on `PRODUCTION` environment.

### Linting

This project uses `ESLint` for static code analysis.
`Prettier` is configured to format the code according to `ESLint` rules.

Below commands help to resolve some conflicts automatically:

```
yarn prettier:fix
yarn lint:fix
```

## Todo

-   integration tests.
-   finish authentication with Cognito.
-   use api gateway route validation instead of Lambda proxy integration.
-   implement CI/CD.
-   centralize the logic into layers for reusing purposes.
-   add time limit and billing controll specifications.
-   improve code by adding more abstraction layers(dependency inversion).
-   separate TypeScript build form files.
-   finish disable restaurant voted in the week.
-   decide business logic related to vote draw.
-   maybe add sns/socket to send push notification
-   implement add restaurant
-   fix typescript any types to proper types
