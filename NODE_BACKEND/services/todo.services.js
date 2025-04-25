const ToDoModel = require("../models/todo.model");

class ToDoService {
  static async createToDo(userId, title, description) {
    try {
      const newTodo = new ToDoModel({
        userId,
        title,
        description
      });
      return await newTodo.save();
    } catch (error) {
      throw new Error(`Failed to create todo: ${error.message}`);
    }
  }

  static async getUserToDoList(userId) {
    try {
      return await ToDoModel.find({ userId })
        .sort({ createdAt: -1 }); // Newest first
    } catch (error) {
      throw new Error(`Failed to fetch todos: ${error.message}`);
    }
  }

  static async deleteToDo(id) {
    try {
      const deleted = await ToDoModel.findByIdAndDelete(id); // Fixed parameter
      if (!deleted) {
        throw new Error('Todo not found');
      }
      return deleted;
    } catch (error) {
      throw new Error(`Failed to delete todo: ${error.message}`);
    }
  }

  // Additional useful methods
  static async updateToDo(id, updates) {
    return await ToDoModel.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
  }

  static async getTodoById(id) {
    return await ToDoModel.findById(id);
  }
}

module.exports = ToDoService;