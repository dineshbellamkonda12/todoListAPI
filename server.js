const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const taskRoutes = require('./routes');

const app = express();
const port = 3000;
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'todoList';

let db;

console.log('Attempting to connect to MongoDB...');

const connectToDatabase = async () => {
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    db = client.db(dbName);
    console.log(`Connected MongoDB: ${url}`);
    console.log(`Database: ${dbName}`);
    
    // Start the server only after the database connection is established
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
  } catch (err) {
    console.error('Failed to connect to the database:', err);
    process.exit(1); // Exit the process with a failure code
  }
};

connectToDatabase();

app.use(bodyParser.json());

app.use((req, res, next) => {
  if (!db) {
    return res.status(500).send('Database connection not established');
  }
  req.db = db;
  next();
});

app.use('/api', taskRoutes);
