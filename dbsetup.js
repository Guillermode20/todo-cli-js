const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'todo',
    password: '200105',
    port: 5432,
});

const createTableQuery = `
DROP TABLE IF EXISTS tasks;
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    task TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

client.connect()
    .then(() => {
        console.log('Connected to the database');
        return client.query(createTableQuery);
    })
    .then(() => {
        console.log('Table created successfully');
    })
    .catch(err => {
        console.error('Error executing query', err.stack);
    })
    .finally(() => {
        client.end();
    });