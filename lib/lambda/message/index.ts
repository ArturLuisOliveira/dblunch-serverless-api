import { zonedTimeToUtc } from 'date-fns-tz';
import { isAfter, isEqual, format } from 'date-fns';
import * as AWS from 'aws-sdk';
import * as _ from 'lodash';
const db = new AWS.DynamoDB.DocumentClient();
const VOTES_TABLE_NAME = process.env.VOTES_TABLE_NAME || '';

export const get = async (event: any = {}) => {
    const { email } = event.queryStringParameters;

    //decided
    const votesCloseAt = zonedTimeToUtc(new Date(), 'Etc/GMT+3');
    if (isAfter(new Date(), votesCloseAt) || isEqual(new Date(), votesCloseAt)) {
    }

    //already voted
    const dayVotes = await db
        .query({
            TableName: VOTES_TABLE_NAME,
            IndexName: 'date',
            KeyConditionExpression: '#date = :currentDate',
            ExpressionAttributeNames: {
                '#date': 'date'
            },
            ExpressionAttributeValues: {
                ':currentDate': format(new Date(), 'MM/DD/YYYY')
            }
        })
        .promise();

    const mostVoted = _.countBy(dayVotes, 'restaurant');
    return { statusCode: 200, body: JSON.stringify({ mostVoted }) };
};
