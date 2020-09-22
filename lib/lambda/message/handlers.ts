import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { isAfter, isEqual } from 'date-fns';
import Database from './queries';
import * as _ from 'lodash';
import { forIn } from 'lodash';

export const votesAreClosed = (currentDate: Date = new Date(), localCloseDate: Date = new Date()): Boolean => {
    localCloseDate.setHours(11);
    localCloseDate.setMinutes(0);
    localCloseDate.setSeconds(0);
    localCloseDate.setMilliseconds(0);
    const utcCloseTime = utcToZonedTime(localCloseDate, 'Etc/GMT+3');
    if (currentDate.valueOf() >= utcCloseTime.valueOf()) {
        return true;
    }
    return false;
};

export const userDidVote = async (db: Database, email: string): Promise<Boolean> => {
    const userVote = await db.findUserVote(email);
    if (!userVote) return false;
    return true;
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

export const todayRestaurants = async (db: Database): Promise<Array<any>> => {
    const todayVotes = await db.listTodayVotes();
    //no votes
    if (!todayVotes.length) return [];

    const mostVotedRestaurants = _mostVotedRestaurants(todayVotes);
    //one restaurant
    if (mostVotedRestaurants.length === 1) return mostVotedRestaurants;

    //many restaurants
    return mostVotedRestaurants;
};
