import * as AWS from 'aws-sdk';
const db = new AWS.DynamoDB.DocumentClient();
import { format } from 'date-fns';

class Database {
    VOTES_TABLE_NAME: string;

    constructor(VOTES_TABLE_NAME?: string) {
        this.VOTES_TABLE_NAME = VOTES_TABLE_NAME || '';
        this.listTodayVotes = this.listTodayVotes.bind(this);
        this.findUserVote = this.findUserVote.bind(this);
    }

    async listTodayVotes(): Promise<Array<any>> {
        const votes = await db
            .query({
                TableName: this.VOTES_TABLE_NAME,
                IndexName: 'date',
                KeyConditionExpression: '#date = :currentDate',
                ExpressionAttributeNames: {
                    '#date': 'date'
                },
                ExpressionAttributeValues: {
                    ':currentDate': new Date().toLocaleDateString()
                }
            })
            .promise();
        return votes.Items || [];
    }
    async findUserVote(email: string): Promise<any> {
        const vote = await db
            .get({ TableName: this.VOTES_TABLE_NAME, Key: { email, date: new Date().toLocaleDateString() } })
            .promise();

        return vote.Item;
    }
}

export default Database;
