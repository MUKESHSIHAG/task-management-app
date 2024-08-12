const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

// Create a new Express application
const app = express();
const PORT = 5000;

// Database connection setup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'task_management',
  password: '12345678',
  port: 5432,
});

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Routes

// Test route
app.get('/', (req, res) => {
  res.send('Task Management API');
});

// Create a new board
app.post('/boards', async (req, res) => {
  const { name } = req.body;
  try {
    const newBoard = await pool.query(
      'INSERT INTO boards (name) VALUES($1) RETURNING *',
      [name]
    );
    res.json(newBoard.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all boards
app.get('/boards', async (req, res) => {
  try {
    const allBoards = await pool.query('SELECT * FROM boards');
    res.json(allBoards.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a specific board by ID
app.get('/boards/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const board = await pool.query('SELECT * FROM boards WHERE id = $1', [id]);
    if (board.rows.length === 0) {
      return res.status(404).json({ msg: 'Board not found' });
    }
    res.json(board.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a new task
app.post('/tasks', async (req, res) => {
  const { title, board_id, status } = req.body;
  try {
    const newTask = await pool.query(
      'INSERT INTO tasks (title, board_id, status) VALUES($1, $2, $3) RETURNING *',
      [title, board_id, status]
    );
    res.json(newTask.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get tasks by board ID
app.get('/boards/:id/tasks', async (req, res) => {
  const { id } = req.params;
  try {
    const tasks = await pool.query('SELECT * FROM tasks WHERE board_id = $1', [id]);
    res.json(tasks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all boards with task count
app.get('/boards', async (req, res) => {
  try {
    const boards = await pool.query(`
      SELECT 
        b.id, 
        b.name, 
        COUNT(t.id) as task_count 
      FROM boards b
      LEFT JOIN tasks t ON t.board_id = b.id
      GROUP BY b.id
    `);
    res.json(boards.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a task by ID
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, status } = req.body;
  try {
    const updatedTask = await pool.query(
      'UPDATE tasks SET title = $1, status = $2 WHERE id = $3 RETURNING *',
      [title, status, id]
    );
    if (updatedTask.rows.length === 0) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.json(updatedTask.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a task by ID
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleteTask = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    if (deleteTask.rows.length === 0) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.json({ msg: 'Task deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a board by ID
app.put('/boards/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedBoard = await pool.query(
      'UPDATE boards SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    if (updatedBoard.rows.length === 0) {
      return res.status(404).json({ msg: 'Board not found' });
    }
    res.json(updatedBoard.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a board by ID
app.delete('/boards/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleteBoard = await pool.query('DELETE FROM boards WHERE id = $1 RETURNING *', [id]);
    if (deleteBoard.rows.length === 0) {
      return res.status(404).json({ msg: 'Board not found' });
    }
    res.json({ msg: 'Board deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete all tasks for a specific board
app.delete('/boards/:id/tasks', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tasks WHERE board_id = $1', [id]);
    res.json({ msg: 'All tasks deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

