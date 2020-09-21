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
    const vote: Vote = { date: format(new Date(), 'mm/dd/yyyy'), email: token, restaurant };
    const query = await db.put({ TableName: VOTES_TABLE_NAME, Item: vote }).promise();
    return {
        statusCode: 201,
        body: JSON.stringify({ vote }),
        headers: { 'Access-Control-Allow-Origin': '*' }
    };
};

/**
 *
 * @todo should find by header token, not email.
 */
export const available = async (event: any) => {
    const { email } = event.queryStringParameters;
    if (!email)
        return {
            statusCode: 401,
            body: JSON.stringify({ msg: 'bad request' }),
            headers: { 'Access-Control-Allow-Origin': '*' }
        };
    const vote = await db
        .get({ TableName: VOTES_TABLE_NAME, Key: { email, date: format(new Date(), 'mm/dd/yyyy') } })
        .promise();
    if (!vote.Item)
        return {
            statusCode: 200,
            body: JSON.stringify({ available: false }),
            headers: { 'Access-Control-Allow-Origin': '*' }
        };
    return {
        statusCode: 200,
        body: JSON.stringify({ available: true }),
        headers: { 'Access-Control-Allow-Origin': '*' }
    };
};
