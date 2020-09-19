import * as faker from 'faker';
const User = (data: any = {}): User => ({
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...data
});
export default User;
