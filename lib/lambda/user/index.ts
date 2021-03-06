import * as AWS from 'aws-sdk';
const db = new AWS.DynamoDB.DocumentClient();

const USERS_TABLE_NAME: string = process.env.USERS_TABLE_NAME || '';

export const login = async (event: any) => {
    const { email, password } = JSON.parse(event.body);
    const user = (await db.get({ TableName: USERS_TABLE_NAME, Key: { email } }).promise()).Item;

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

    //MOCKED RESPONSE, SHOULD SEND TOKEN, NOT EMAIL
    return {
        statusCode: 201,
        body: JSON.stringify({ msg: 'received', token: email }),
        headers: { 'Access-Control-Allow-Origin': '*' }
    };
};
