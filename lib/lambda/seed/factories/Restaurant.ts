import * as faker from 'faker';
const Restaurant = (data: any = {}): Restaurant => ({ name: faker.lorem.word(), ...data });
export default Restaurant;
