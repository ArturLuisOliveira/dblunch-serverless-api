import Database, * as queries from './queries';
import { votesAreClosed, todayRestaurants, userDidVote } from './handlers';

const VOTES_TABLE_NAME = process.env.VOTES_TABLE_NAME || '';
const db = new Database(VOTES_TABLE_NAME);
const responses = {
    closed: (restaurant: Restaurant) => ({
        statusCode: 200,
        body: JSON.stringify({ msg: `Hoje o almoço será no ${restaurant}`, enabled: false, alertType: 'success' }),
        headers: { 'Access-Control-Allow-Origin': '*' }
    }),
    soon: {
        statusCode: 200,
        body: JSON.stringify({
            msg: 'Em breve será decidido o restaurante.',
            enabled: false,
            alertType: 'info'
        }),
        headers: { 'Access-Control-Allow-Origin': '*' }
    },
    vote: {
        statusCode: 200,
        body: JSON.stringify({ msg: 'Vote para decidir o restaurante', enabled: true, alertType: 'warning' }),
        headers: { 'Access-Control-Allow-Origin': '*' }
    },
    noVotes: {
        statusCode: 200,
        body: JSON.stringify({
            msg: 'Não houveram votos para o restaurante de hoje',
            enabled: false,
            alertType: 'error'
        }),
        headers: { 'Access-Control-Allow-Origin': '*' }
    },
    draw: (restaurants: Array<any>) => ({
        statusCode: 200,
        body: JSON.stringify({
            msg: `Houve um empate entre os restaurantes${restaurants.reduce((acc, cur) => ` ${acc} ${cur}`, '')}.`,
            enabled: false,
            alertType: 'error'
        }),
        headers: { 'Access-Control-Allow-Origin': '*' }
    })
};

/**
 * @todo User email should be found by the header token.
 */

export const get = async (event: any = {}) => {
    const { email } = event.queryStringParameters;

    if (votesAreClosed()) {
        const restaurants: Array<any> = await todayRestaurants(db);
        //no votes
        if (!restaurants.length) return responses.noVotes;

        //restaurant decided
        if (restaurants.length === 1) return responses.closed(restaurants[0]);

        //draw
        return responses.draw(restaurants);
    }

    const voted = await userDidVote(db, email);

    return voted ? responses.soon : responses.vote;
};
