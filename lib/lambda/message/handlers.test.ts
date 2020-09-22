import { votesAreClosed, todayRestaurants, userDidVote } from './handlers';
import { isAfter, isEqual, addDays } from 'date-fns';
import Database from './queries';
import { Vote } from '../seed/factories';
import * as _ from 'lodash';

describe('votesAreClosed function', () => {
    test('it should be closed', () => {
        const currentDate = new Date('2020-01-01 20:00:00.000');
        const localCloseTime: Date = new Date('2020-01-01  20:00:00.000');
        const closed = votesAreClosed(currentDate, localCloseTime);
        expect(closed).toEqual(true);
    });

    test('it should be open', () => {
        const currentDate = new Date('2020-01-01 04:00:00.000');
        const localCloseTime: Date = new Date('2020-01-01  20:00:00.000');
        const closed = votesAreClosed(currentDate, localCloseTime);
        expect(closed).toEqual(false);
    });
});

describe('userDidVote function', () => {
    test('it should have voted', async () => {
        class MockedDb extends Database {
            VOTES_TABLE_NAME: string;
            async listTodayVotes(): Promise<Array<any>> {
                return [];
            }
            async findUserVote(email: string): Promise<any> {
                return {
                    email: 'user@email.com',
                    restaurant: 'Restaurant A',
                    date: new Date().toLocaleDateString()
                };
            }
        }
        const db = new MockedDb();
        const voted = await userDidVote(db, 'user@email.com');
        expect(voted).toEqual(true);
    });
    test("it shouldn't have voted", async () => {
        class MockedDb extends Database {
            VOTES_TABLE_NAME: string;
            async listTodayVotes(): Promise<Array<any>> {
                return [];
            }
            async findUserVote(email: string): Promise<any> {
                return null;
            }
        }

        const db = new MockedDb();
        const voted = await userDidVote(db, 'user@email.com');
        expect(voted).toEqual(false);
    });
});

describe('todayRestaurant function', () => {
    test('it should return most voted restaurant', async () => {
        const votes = [
            Vote({
                restaurant: 'restaurant A',
                date: new Date().toLocaleDateString(),
                email: 'email@email.com'
            }),
            Vote({
                restaurant: 'restaurant A',
                date: new Date().toLocaleDateString(),
                email: 'email@email.com'
            }),
            Vote({
                restaurant: 'restaurant B',
                date: new Date().toLocaleDateString(),
                email: 'email@email.com'
            })
        ];
        class MockedDb extends Database {
            VOTES_TABLE_NAME: string;
            async listTodayVotes(): Promise<Array<any>> {
                return votes;
            }
            async findUserVote(email: string): Promise<any> {
                return {};
            }
        }
        const db = new MockedDb();
        const restaurant = await todayRestaurants(db);
        expect(restaurant[0]).toEqual('restaurant A');
    });

    test('it should return one of the most voted restaurants', async () => {
        const votes = [
            Vote({
                restaurant: 'restaurant A',
                date: new Date().toLocaleDateString(),
                email: 'email1@email.com'
            }),
            Vote({
                restaurant: 'restaurant A',
                date: new Date().toLocaleDateString(),
                email: 'email2@email.com'
            }),
            Vote({
                restaurant: 'restaurant B',
                date: new Date().toLocaleDateString(),
                email: 'email3@email.com'
            }),
            Vote({
                restaurant: 'restaurant B',
                date: new Date().toLocaleDateString(),
                email: 'email4@email.com'
            }),
            Vote({
                restaurant: 'restaurant C',
                date: new Date().toLocaleDateString(),
                email: 'email5@email.com'
            }),
            Vote({
                restaurant: 'restaurant D',
                date: new Date().toLocaleDateString(),
                email: 'email6@email.com'
            })
        ];
        class MockedDb extends Database {
            VOTES_TABLE_NAME: string;
            async listTodayVotes(): Promise<Array<any>> {
                return votes;
            }
            async findUserVote(email: string): Promise<any> {
                return {};
            }
        }
        const db = new MockedDb();
        const restaurant = await todayRestaurants(db);
        expect(restaurant.includes('restaurant A')).toEqual(true);
        expect(restaurant.includes('restaurant B')).toEqual(true);
    });
    test('it should return null', async () => {
        class MockedDb extends Database {
            VOTES_TABLE_NAME: string;
            async listTodayVotes(): Promise<Array<any>> {
                return [];
            }
            async findUserVote(email: string): Promise<any> {
                return {};
            }
        }
        const db = new MockedDb();
        const restaurant = await todayRestaurants(db);
        expect(restaurant).toEqual([]);
    });
});
