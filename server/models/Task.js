const { model, Schema } = require('mongoose');

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'],
    default: 'To Do',
  },
  assignedUser: { type: Schema.Types.ObjectId, ref: 'User' },
  dueDate: { type: Date },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  dateCreated: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = model('Task', taskSchema);