const { MongoClient } = require('mongodb');
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'todoList';

const connectToDatabase = async () => {
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db(dbName);

    // Get today's date (start and end of the day)
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Aggregation for projects with tasks due today
    try {
      const projectsWithTasksDueToday = await db.collection('projects').aggregate([
        { 
          $lookup: { 
            from: 'tasks', 
            localField: '_id', 
            foreignField: 'projectId', 
            as: 'tasks' 
          }
        },
        { $unwind: '$tasks' },
        { 
          $match: { 
            'tasks.dueDate': { 
              $gte: startOfDay, 
              $lte: endOfDay 
            } 
          }
        }
      ]).toArray();

      console.log('Projects with tasks due today:', projectsWithTasksDueToday);
    } catch (err) {
      console.error('Error during projects aggregation:', err);
    }

    // Aggregation for tasks with projects due today
    try {
      const tasksWithProjectsDueToday = await db.collection('tasks').aggregate([
        { 
          $lookup: { 
            from: 'projects', 
            localField: 'projectId', 
            foreignField: '_id', 
            as: 'project' 
          }
        },
        { $unwind: '$project' },
        { 
          $match: { 
            'project.dueDate': { 
              $gte: startOfDay, 
              $lte: endOfDay 
            } 
          }
        }
      ]).toArray();

      console.log('Tasks with projects due today:', tasksWithProjectsDueToday);
    } catch (err) {
      console.error('Error during tasks aggregation:', err);
    }

    client.close();
  } catch (err) {
    console.error('Failed to connect to the database:', err);
  }
};

connectToDatabase();
