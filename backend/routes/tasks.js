const express = require('express');
const {
  createTask,
  getTasks,
  deleteTask,
  updateTask,
} = require('../controllers/taskController');
const requireAuth = require('../middleware/requireAuth');
const User = require('../models/userModel');

const router = express.Router();

// require auth for all task routes
router.use(requireAuth);

// GET all tasks
router.get('/', getTasks);

// POST a new task
router.post('/', createTask);

// DELETE a task
router.delete('/:id', deleteTask);

// UPDATE a task
router.patch('/:id', updateTask);

//Get all the users name
router.get('/getusers', async (req, res) => {
  const users = await User.find({});
  let usersArray = new Array();
  users.map((user) => {
    usersArray.push(user.email);
  });

  res.status(200).json({ usersArray });
});

module.exports = router;
