import * as AWS from 'aws-sdk';
import * as factories from './factories';
import * as faker from 'faker';

const db = new AWS.DynamoDB.DocumentClient();

const RESTAURANTS_TABLE_NAME: string = process.env.RESTAURANTS_TABLE_NAME || '';
const USERS_TABLE_NAME: string = process.env.USERS_TABLE_NAME || '';
const VOTES_TABLE_NAME: string = process.env.VOTES_TABLE_NAME || '';

export const seed = async (event: any) => {
    const _seedTable = async (TableName: string, Factory: any, amount: number, args?: any) => {
        const values = Array(amount)
            .fill(null)
            .map(() => Factory(args));
        await Promise.all(values.map((Item) => db.put({ TableName, Item }).promise()));
        return values;
    };

    //test user
    await db
        .put({ TableName: USERS_TABLE_NAME, Item: factories.User({ email: 'test@email.com', password: 'test123' }) })
        .promise();

    const restaurants: Array<Restaurant> = await _seedTable(RESTAURANTS_TABLE_NAME, factories.Restaurant, 5);
    const users: Array<User> = await _seedTable(USERS_TABLE_NAME, factories.User, 5);
    const votes: Array<Vote> = await _seedTable(VOTES_TABLE_NAME, factories.Vote, 10, {
        restaurant: restaurants[faker.random.number({ max: restaurants.length - 1, min: 0 })].name,
        email: users[faker.random.number({ max: users.length - 1, min: 0 })].email
    });

    return { statusCode: 201, body: JSON.stringify({ msg: 'created' }) };
};
