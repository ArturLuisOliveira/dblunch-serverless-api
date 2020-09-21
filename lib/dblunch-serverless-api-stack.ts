import * as cdk from '@aws-cdk/core';
import ApiGateway from './api_gateway';
import Dynamodb from './dynamodb';
import Lambda from './lambda';
require('dotenv').config();
export class DblunchServerlessApiStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        //database
        const { restaurants, users, votes } = Dynamodb(this);

        //controllers
        const { listRestaurants, getMessage, seed, login, createVote, votingIsAvailable } = Lambda(
            this,
            votes,
            restaurants,
            users
        );

        //routes
        ApiGateway(this, getMessage, seed, listRestaurants, login, createVote, votingIsAvailable);
    }
}
