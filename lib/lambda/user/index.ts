import * as AWS from 'aws-sdk';
const db = new AWS.DynamoDB.DocumentClient();

const USERS_TABLE_NAME: string = process.env.USERS_TABLE_NAME || '';

export const login = async (event: any) => {
    console.log('the event is', event);
    const { email, password } = JSON.parse(event.body);
    console.log('the email is', email);
    const user = (await db.get({ TableName: USERS_TABLE_NAME, Key: { email } }).promise()).Item;
    console.log('user', user);
    if (!user)
        return {
            statusCode: 401,
            body: JSON.stringify({ msg: 'Email inválido' }),
            headers: { 'Access-Control-Allow-Origin': '*' }
        };

    if (password !== user.password)
        return {
            statusCode: 401,
            body: JSON.stringify({ msg: 'Senha inválida' }),
            headers: { 'Access-Control-Allow-Origin': '*' }
        };

    return {
        statusCode: 201,
        body: JSON.stringify({ msg: 'received', token: '123456789' }),
        headers: { 'Access-Control-Allow-Origin': '*' }
    };
};
