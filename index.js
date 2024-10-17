const { Client } = require('pg');
const { Command } = require('commander');

const program = new Command();

program
    .description('A simple todo CLI')
    .option('--new <task...>', 'Add a new task')
    .option('--list [pending|done]', 'List all tasks')
    .option('--done <taskId>', 'Mark a task as done')
    .option('--delete <taskId>', 'Delete a task')
    .option('--delete-all', 'Delete all tasks')

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'todo',
    password: '200105',
    port: 5432,
});

// New Task Function
async function addNewTask(task) {
    try {
        await client.connect();

        // Find the lowest available ID
        const idRes = await client.query(`
            SELECT MIN(id + 1) AS lowest_id
            FROM tasks
            WHERE (id + 1) NOT IN (SELECT id FROM tasks)
        `);
        const lowestId = idRes.rows[0].lowest_id || 1; // Default to 1 if no tasks exist

        const taskString = Array.isArray(task) ? task.join(' ') : task;
        const res = await client.query('INSERT INTO tasks (id, task) VALUES ($1, $2) RETURNING *', [lowestId, taskString]);
        console.log(`Task added with ID: ${res.rows[0].id}`);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        await client.end();
    }
}

// List Task Function
async function listTasks(status) {
    try {
        await client.connect();
        let query = 'SELECT * FROM tasks';
        let params = [];

        if (status === 'pending' || status === 'done') {
            query += ' WHERE status = $1';
            params.push(status);
        }

        const res = await client.query(query, params);
        res.rows.forEach(row => {
            console.log(`${row.id}: ${row.task}`);
        });
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

// Delete All Function
async function deleteAllTasks() {
    try {
        await client.connect();
        await client.query('DELETE FROM tasks');
        console.log('All tasks deleted');
    }
    catch (e) {
        console.error(e);
    }
    finally {
        await client.end();
    }
}

async function deleteTask(taskId) {
    try {
        await client.connect();
        await client.query('DELETE FROM tasks WHERE id = $1', [taskId]);
        console.log(`Task ${taskId} deleted`);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        await client.end();
    }
}

async function markTaskDone(taskId) {
    try {
        await client.connect();
        await client.query('UPDATE tasks SET status = $1 WHERE id = $2', ['done', taskId]);
        console.log(`Task ${taskId} marked as done`);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        await client.end();
    }
}

async function run() {
    program.parse(process.argv);
    const options = program.opts();

    if (options.new) {
        const task = options.new.join(' '); // <task...> is an array, so must be joined into a string
        await addNewTask(task);
    }
    if (options.list) {
        await listTasks(options.list);
    }
    if (options.deleteAll) {
        await deleteAllTasks();
    }
    if (options.delete) {
        await deleteTask(options.delete);
    }
    if (options.done) {
        await markTaskDone(options.done);
    }
}

run();
