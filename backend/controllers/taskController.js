const Task = require('../models/taskModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

// get all tasks
const getTasks = async (req, res) => {
  console.log(req.user);
  const user_id = req.user._id;

  const tasks = await Task.find({ user_id }).sort({ createdAt: -1 });
  res.status(200).json(tasks);
};

// create new task
const createTask = async (req, res) => {
  const { title, description, dueDate, assignedUser } = req.body;

  let emptyFields = [];

  if (!title) {
    emptyFields.push('title');
  }
  if (!description) {
    emptyFields.push('decription');
  }
  if (!dueDate) {
    emptyFields.push('dueDate');
  }
  if (!assignedUser) {
    emptyFields.push('assignedUser');
  }
  console.log(req.body);
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: 'Please fill in all the fields', emptyFields });
  }

  // add doc to db
  try {
    const user_id = req.user._id;
    const task = await Task.create({
      title,
      description,
      dueDate,
      assignedUser,
      user_id,
    });
    User.findOneAndUpdate(
      { _id: user_id },
      { $push: { tasks: task._id } },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
        } else {
          console.log(updatedUser);
        }
      }
    );
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a task
const deleteTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such task' });
  }

  const task = await Task.findOneAndDelete({ _id: id });

  if (!task) {
    return res.status(400).json({ error: 'No such task' });
  }

  res.status(200).json(task);
};

// update a task
const updateTask = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such task' });
  }

  const task = await Task.findOneAndUpdate(
    { _id: id },
    {
      status: req.body.status,
    },
    { new: true }
  );

  if (!task) {
    return res.status(400).json({ error: 'No such task' });
  }

  res.status(200).json(task);
};

module.exports = {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
};
