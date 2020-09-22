import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as path from 'path';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

import Layers from './layers';

interface Functions {
    listRestaurants: lambda.Function;
    getMessage: lambda.Function;
    seed: lambda.Function;
    login: lambda.Function;
    createVote: lambda.Function;
}

const Lambda = (
    scope: cdk.Stack,
    votesTable: dynamodb.Table,
    restaurantsTable: dynamodb.Table,
    usersTable: dynamodb.Table
): Functions => {
    const { datefns, lodash, faker } = Layers(scope);

    const seed = new lambda.Function(scope, 'seed', {
        code: new lambda.AssetCode(path.join('lib', 'lambda', 'seed')),
        handler: 'index.seed',
        runtime: lambda.Runtime.NODEJS_10_X,
        layers: [datefns, faker],
        environment: {
            VOTES_TABLE_NAME: votesTable.tableName,
            USERS_TABLE_NAME: usersTable.tableName,
            RESTAURANTS_TABLE_NAME: restaurantsTable.tableName
        },
        timeout: cdk.Duration.seconds(30)
    });
    votesTable.grantWriteData(seed);
    usersTable.grantWriteData(seed);
    restaurantsTable.grantWriteData(seed);

    const listRestaurants = new lambda.Function(scope, 'listRestaurants', {
        code: new lambda.AssetCode(path.join('lib', 'lambda', 'restaurant')),
        handler: 'index.list',
        runtime: lambda.Runtime.NODEJS_10_X,
        environment: {
            RESTAURANTS_TABLE_NAME: restaurantsTable.tableName
        }
    });
    restaurantsTable.grantReadData(listRestaurants);

    const login = new lambda.Function(scope, 'login', {
        code: new lambda.AssetCode(path.join('lib', 'lambda', 'user')),
        handler: 'index.login',
        runtime: lambda.Runtime.NODEJS_10_X,
        environment: {
            USERS_TABLE_NAME: usersTable.tableName
        }
    });
    usersTable.grantReadWriteData(login);

    const getMessage = new lambda.Function(scope, 'getMessage', {
        code: new lambda.AssetCode(path.join('lib', 'lambda', 'message')),
        handler: 'index.get',
        runtime: lambda.Runtime.NODEJS_10_X,
        layers: [datefns, lodash],
        environment: {
            VOTES_TABLE_NAME: votesTable.tableName
        },
        timeout: cdk.Duration.seconds(30)
    });
    votesTable.grantReadData(getMessage);

    const createVote = new lambda.Function(scope, 'createVote', {
        code: new lambda.AssetCode(path.join('lib', 'lambda', 'vote')),
        handler: 'index.create',
        runtime: lambda.Runtime.NODEJS_10_X,
        layers: [datefns],
        environment: {
            VOTES_TABLE_NAME: votesTable.tableName
        }
    });
    votesTable.grantWriteData(createVote);

    return { listRestaurants, getMessage, seed, login, createVote };
};
export default Lambda;
