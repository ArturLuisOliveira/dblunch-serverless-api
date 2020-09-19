import * as AWS from 'aws-sdk';
const db = new AWS.DynamoDB.DocumentClient();
const VOTES_TABLE_NAME: string = process.env.VOTES_TABLE_NAME || '';

import { format } from 'date-fns';

export const create = async (event: any) => {
    const { email, restaurant } = event.queryStringParameters;
    if (!email || !restaurant)
        return {
            statusCode: 401,
            body: JSON.stringify({ msg: 'bad request' }),
            headers: { 'Access-Control-Allow-Origin': '*' }
        };
    const vote: Vote = { date: format(new Date(), 'mm/dd/yyyy'), email, restaurant };
    const query = await db.put({ TableName: VOTES_TABLE_NAME, Item: vote }).promise();
    return {
        statusCode: 201,
        body: JSON.stringify({ vote }),
        headers: { 'Access-Control-Allow-Origin': '*' }
    };
};
