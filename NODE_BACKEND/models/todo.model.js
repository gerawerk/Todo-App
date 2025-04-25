const mongoose = require('mongoose');
const UserModel = require('./user.model');
const { Schema } = mongoose;

const toDoSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Direct reference to model name
    required: true,
    validate: {
      validator: async (value) => {
        const user = await UserModel.findById(value);
        return user !== null;
      },
      message: 'User does not exist'
    }
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster querying
toDoSchema.index({ userId: 1 });
toDoSchema.index({ title: 'text' });
toDoSchema.index({ status: 1 });
toDoSchema.index({ priority: 1 });

// Virtual for formatted createdAt
toDoSchema.virtual('createdAtFormatted').get(function() {
  return this.createdAt.toLocaleString();
});

const ToDoModel = mongoose.model('Todo', toDoSchema);
module.exports = ToDoModel;