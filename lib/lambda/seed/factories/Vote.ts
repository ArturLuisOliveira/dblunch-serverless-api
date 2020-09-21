import * as faker from 'faker';
import { format } from 'date-fns';

const Vote = (data: any = {}): Vote => ({
    restaurant: faker.lorem.word(),
    date: faker.date.recent(10).toLocaleDateString(),
    email: faker.internet.email(),
    ...data
});
export default Vote;
