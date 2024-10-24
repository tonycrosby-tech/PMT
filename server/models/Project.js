const { model, Schema } = require('mongoose');
const mongoose = require('mongoose');

const projectSchema = new Schema({
  title: { type: String, required: true, unique: false },
  description: { type: String, required: true, unique: false },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  status: {
    type: String,
    enum: ['active', 'completed', 'in progress', 'archived'],
    default: 'active',
  },
  dateCreated: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
});

//const Book = mongoose.model("Book", bookSchema);
module.exports = model('Project', projectSchema);
