import * as AWS from 'aws-sdk';
const db = new AWS.DynamoDB.DocumentClient();

const RESTAURANTS_TABLE_NAME: string = process.env.RESTAURANTS_TABLE_NAME || '';

export const list = async () => {
    const restaurants = await db.scan({ TableName: RESTAURANTS_TABLE_NAME }).promise();
    return { statusCode: 200, body: JSON.stringify({ restaurants }), headers: { 'Access-Control-Allow-Origin': '*' } };
};
