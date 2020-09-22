import * as cdk from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';
import { makeId } from '../utils/helpers';

const ApiGateway = (
    scope: cdk.Stack,
    getMessage: lambda.Function,
    seed: lambda.Function,
    listRestaurants: lambda.Function,
    login: lambda.Function,
    createVote: lambda.Function
) => {
    const api = new apigateway.RestApi(scope, makeId('dblunch'), {
        restApiName: 'Dblunch',
        defaultCorsPreflightOptions: {
            allowOrigins: apigateway.Cors.ALL_ORIGINS
        }
    });

    const integrations = {
        seed: new apigateway.LambdaIntegration(seed),
        getMessage: new apigateway.LambdaIntegration(getMessage),
        listRestaurants: new apigateway.LambdaIntegration(listRestaurants),
        login: new apigateway.LambdaIntegration(login),
        createVote: new apigateway.LambdaIntegration(createVote)
    };

    //seed
    if (process.env.ENVIRONMENT !== 'PRODUCTION') {
        const seedIntegration = new apigateway.LambdaIntegration(seed);
        api.root.addMethod('POST', seedIntegration);
    }

    //messages
    const messageResource = api.root.addResource('messages');
    messageResource.addMethod('GET', integrations.getMessage);

    //restaurants
    const restaurantResource = api.root.addResource('restaurants');
    restaurantResource.addMethod('GET', integrations.listRestaurants);

    //vote
    const voteResource = api.root.addResource('vote');
    voteResource.addMethod('POST', integrations.createVote);

    //users
    const usersResource = api.root.addResource('users');
    const loginResource = usersResource.addResource('login');
    loginResource.addMethod('POST', integrations.login);
};

export default ApiGateway;
