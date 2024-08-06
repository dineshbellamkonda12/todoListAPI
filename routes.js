const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// Create a Task
router.post('/tasks', async (req, res) => {
  const task = req.body;
  const taskCollection = req.db.collection('tasks');
  const projectCollection = req.db.collection('projects');

  try {
    // Check if project exists
    if (task.projectId) {
      const project = await projectCollection.findOne({ _id: new ObjectId(task.projectId) });
      if (!project) {
        return res.status(404).json({ error: 'Project does not exist' });
      }
    }

    const result = await taskCollection.insertOne(task);
    res.status(201).json(result.ops[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// List all Tasks
router.get('/tasks', async (req, res) => {
  const collection = req.db.collection('tasks');
  try {
    const tasks = await collection.find().toArray();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit a Task
router.put('/tasks/:id', async (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  const collection = req.db.collection('tasks');
  try {
    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Delete a Task
router.delete('/tasks/:id', async (req, res) => {
  const id = req.params.id;
  const collection = req.db.collection('tasks');
  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Mark Task as To-Do/Done
router.patch('/tasks/:id/status', async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const collection = req.db.collection('tasks');
  
  try {
    const task = await collection.findOne({ _id: new ObjectId(id) });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    const updates = { status };
    if (status === 'to-do') {
      updates.startDate = new Date();
      updates.doneDate = null;
    } else if (status === 'done') {
      updates.doneDate = new Date();
    }
    
    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Filter Tasks by Status
router.get('/tasks/filter/:status', async (req, res) => {
  const status = req.params.status;
  const collection = req.db.collection('tasks');
  try {
    const tasks = await collection.find({ status }).toArray();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search Tasks by Name

router.get('/tasks/search/:name', async (req, res) => {
  const name = req.params.name;
  const collection = req.db.collection('tasks');
  
  try {
    const tasks = await collection.find({ name: new RegExp(name, 'i') }).toArray();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sort Tasks by Dates
router.get('/tasks/sort/:dateField', async (req, res) => {
  const dateField = req.params.dateField;
  const collection = req.db.collection('tasks');
  try {
    const tasks = await collection.find().sort({ [dateField]: 1 }).toArray();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Project Routes

// Create a Project
router.post('/projects', async (req, res) => {
  const project = req.body;
  const collection = req.db.collection('projects');
  try {
    const result = await collection.insertOne(project);
    res.status(201).json(result.ops[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all Projects
router.get('/projects', async (req, res) => {
  const collection = req.db.collection('projects');
  try {
    const projects = await collection.find().toArray();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit a Project
router.put('/projects/:id', async (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  const collection = req.db.collection('projects');
  try {
    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Delete a Project
router.delete('/projects/:id', async (req, res) => {
  const id = req.params.id;
  const collection = req.db.collection('projects');
  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Assign Task to a Project
router.patch('/tasks/:id/project', async (req, res) => {
  const id = req.params.id;
  const { newProjectId } = req.body;
  const collection = req.db.collection('tasks');
  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { projectId: newProjectId } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Filter Tasks by Project Name
router.get('/tasks/filter/project/:name', async (req, res) => {
  const name = req.params.name;
  const tasksCollection = req.db.collection('tasks');
  const projectsCollection = req.db.collection('projects');

  try {
    const project = await projectsCollection.findOne({ name: new RegExp(name, 'i') });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const tasks = await tasksCollection.find({ projectId: project._id }).toArray();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sort Projects by Dates
router.get('/projects/sort/:dateField', async (req, res) => {
  const dateField = req.params.dateField;
  const collection = req.db.collection('projects');
  try {
    const projects = await collection.find().sort({ [dateField]: 1 }).toArray();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
