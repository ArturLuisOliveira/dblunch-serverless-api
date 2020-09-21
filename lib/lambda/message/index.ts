import Database, * as queries from './queries';
import { votesAreClosed, todayRestaurant, userDidVote } from './handlers';

const VOTES_TABLE_NAME = process.env.VOTES_TABLE_NAME || '';
const db = new Database(VOTES_TABLE_NAME);
const responses = {
    closed: (restaurant: Restaurant) => ({
        statusCode: 200,
        body: JSON.stringify({ msg: `Hoje o almoço será no ${restaurant.name}`, enabled: false })
    }),
    soon: { statusCode: 200, body: JSON.stringify({ msg: 'Em breve será decidido o restaurante.', enabled: false }) },
    vote: { msg: 'Vote para decidir o restaurante', enabled: true },
    noVotes: { msg: 'Não houveram votos para o restaurante de hoje', enabled: false }
};

export const get = async (event: any = {}) => {
    const { email } = event.queryStringParameters;

    if (votesAreClosed()) {
        const restaurant = await todayRestaurant(db);
        if (!restaurant) return responses.noVotes;
        return responses.closed(restaurant);
    }

    const voted = await userDidVote(db, email);

    return voted ? responses.soon : responses.vote;
};
