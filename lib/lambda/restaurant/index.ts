//import { listRestaurantsWithAvailabilityStatus } from './handlers';
import Database from './queries';

const RESTAURANTS_TABLE_NAME: string = process.env.RESTAURANTS_TABLE_NAME || '';
const VOTES_TABLE_NAME: string = process.env.VOTES_TABLE_NAME || '';

const db = new Database(RESTAURANTS_TABLE_NAME, VOTES_TABLE_NAME);

export const list = async () => {
    const allRestaurants = await db.listRestaurants();
    //const restaurantsWithAvailabilityStatus = await listRestaurantsWithAvailabilityStatus(db, allRestaurants);

    return {
        statusCode: 200,
        body: JSON.stringify({ restaurants: allRestaurants }),
        headers: { 'Access-Control-Allow-Origin': '*' }
    };
};
