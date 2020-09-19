import * as faker from 'faker';
import { format } from 'date-fns';

const Vote = (data: any = {}): Vote => ({
    restaurant: faker.lorem.word(),
    date: format(faker.date.recent(10), 'mm/dd/yyyy'),
    email: faker.internet.email(),
    ...data
});
export default Vote;
