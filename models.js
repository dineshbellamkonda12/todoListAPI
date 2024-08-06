// Task Schema
const taskSchema = {
    name: String,
    description: String,
    status: String, // "to-do", "done"
    startDate: Date,
    dueDate: Date,
    doneDate: Date,
    projectId: String
  };
  
  // Project Schema
  const projectSchema = {
    name: String,
    description: String,
    startDate: Date,
    dueDate: Date
  };
  
  module.exports = {
    taskSchema,
    projectSchema
  };
  