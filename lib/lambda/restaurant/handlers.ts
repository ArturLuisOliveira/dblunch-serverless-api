import Database from './queries';
import * as _ from 'lodash';

export const listRestaurantsWithAvailabilityStatus = async (db: Database, allRestaurants: Array<any>) => {
    return Promise.all(allRestaurants.map((restaurant) => getRestaurantWithAvailabilityStatus(db, restaurant)));
};
export const getRestaurantWithAvailabilityStatus = async (db: Database, restaurant: any): Promise<any> => {
    const weekDates = getWeekDates();
    const weekRestaurantVotes = await Promise.all(weekDates.map((date) => restaurantWasVoted(db, date, restaurant)));

    return !weekRestaurantVotes.includes(true);
};
export const getWeekDates = () => {
    return [];
};

const _mostVotedRestaurants = (todayVotes: any): Array<string> => {
    const restaurantVotes: any = _.countBy(todayVotes, 'restaurant');
    let highestValue = 0;
    _.forIn(restaurantVotes, (value, key) => {
        if (value > highestValue) highestValue = value;
    });
    const mostVotedRestaurants: Array<string> = [];
    _.forIn(restaurantVotes, (value, key) => {
        if (value === highestValue) mostVotedRestaurants.push(key);
    });
    return mostVotedRestaurants;
};

export const restaurantWasVoted = async (db: Database, date: string, restaurant: string): Promise<Boolean> => {
    const todayVotes = await db.getRestaurantVotesByDay(date, restaurant);
    const mostVotedRestaurants = _mostVotedRestaurants(todayVotes);
    if (mostVotedRestaurants.length === 1) return true;
    return false;
};
