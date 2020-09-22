import * as AWS from 'aws-sdk';
const db = new AWS.DynamoDB.DocumentClient();

class Database {
    RESTAURANTS_TABLE_NAME: string;
    VOTES_TABLE_NAME: string;

    constructor(RESTAURANTS_TABLE_NAME: string, VOTES_TABLE_NAME: string) {
        this.RESTAURANTS_TABLE_NAME = RESTAURANTS_TABLE_NAME;
        this.VOTES_TABLE_NAME = VOTES_TABLE_NAME;
        this.listRestaurants = this.listRestaurants.bind(this);
    }
    async listRestaurants() {
        const restaurants = await db.scan({ TableName: this.RESTAURANTS_TABLE_NAME }).promise();
        return restaurants.Items || [];
    }
    async getRestaurantVotesByDay(date: string, restaurant: string) {
        const votes = await db
            .query({
                TableName: this.VOTES_TABLE_NAME,
                IndexName: 'date',
                KeyConditionExpression: '#date = :currentDate AND #restaurant = :currentRestaurant',
                ExpressionAttributeNames: {
                    '#date': 'date',
                    '#restaurant': 'restaurant'
                },
                ExpressionAttributeValues: {
                    ':currentDate': date,
                    ':currentRestaurant': restaurant
                }
            })
            .promise();
        return votes.Items || [];
    }
}
export default Database;
