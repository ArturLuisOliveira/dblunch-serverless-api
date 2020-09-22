import * as AWS from 'aws-sdk';
const db = new AWS.DynamoDB.DocumentClient();
const VOTES_TABLE_NAME: string = process.env.VOTES_TABLE_NAME || '';

import { format } from 'date-fns';
/**
 * @todo token should come from headers when auth is implemented.
 * @todo validate if user can vote based on the date.
 * @todo check if restaurant exist.
 */
export const create = async (event: any) => {
    const { token, restaurant } = JSON.parse(event.body);
    if (!token || !restaurant)
        return {
            statusCode: 401,
            body: JSON.stringify({ msg: 'bad request' }),
            headers: { 'Access-Control-Allow-Origin': '*' }
        };
    const vote: Vote = { date: new Date().toLocaleDateString(), email: token, restaurant };
    const query = await db.put({ TableName: VOTES_TABLE_NAME, Item: vote }).promise();
    return {
        statusCode: 201,
        body: JSON.stringify({ vote }),
        headers: { 'Access-Control-Allow-Origin': '*' }
    };
};
