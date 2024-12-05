const express = require('express');
const cors = require('cors');
const db = require('./database/database'); // Import the database connection

const app = express();
app.use(cors());
app.use(express.json()); // Allows the server to parse JSON requests

const PORT = 5000;

// Create To-Do
app.post('/todos', (req, res) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).send('Task is required');
  }

  const query = 'INSERT INTO todos (task) VALUES (?)';
  db.query(query, [task], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error adding task');
    }
    res.status(201).send('Task added successfully');
  });
});

// Get All To-Dos
app.get('/todos', (req, res) => {
  const query = 'SELECT * FROM todos';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching tasks');
    }
    res.status(200).json(results);
  });
});

// Delete To-Do
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;

  // Ensure id is a valid number
  if (isNaN(id)) {
    return res.status(400).send('Invalid task ID');
  }

  const query = 'DELETE FROM todos WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting task');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Task not found');
    }
    res.status(200).send('Task deleted successfully');
  });
});

// Ensure database connection is established first
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to the MySQL database!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
