import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import { getRemovalPolicy, makeId } from '../utils/helpers';

interface Tables {
    restaurants: dynamodb.Table;
    votes: dynamodb.Table;
    users: dynamodb.Table;
}

const Dynamodb = (scope: cdk.Stack): Tables => {
    const restaurants: dynamodb.Table = new dynamodb.Table(scope, 'restaurants', {
        partitionKey: { name: 'name', type: dynamodb.AttributeType.STRING },
        tableName: makeId('restaurants'),
        removalPolicy: getRemovalPolicy()
    });

    const votes: dynamodb.Table = new dynamodb.Table(scope, 'votes', {
        partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
        sortKey: { name: 'date', type: dynamodb.AttributeType.STRING },
        tableName: makeId('votes'),
        removalPolicy: getRemovalPolicy()
    });
    votes.addGlobalSecondaryIndex({
        indexName: 'date',
        partitionKey: { name: 'date', type: dynamodb.AttributeType.STRING }
    });

    const users: dynamodb.Table = new dynamodb.Table(scope, 'users', {
        partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
        tableName: makeId('users'),
        removalPolicy: getRemovalPolicy()
    });

    return { restaurants, votes, users };
};

export default Dynamodb;
