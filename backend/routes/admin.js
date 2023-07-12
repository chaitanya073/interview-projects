const express = require('express');
const User = require('../models/userModel');
const Task = require('../models/taskModel');
const mongoose = require('mongoose');
const requireAuth = require('../middleware/requireAuth');
const router = express.Router();

router.use(requireAuth);

router.use((req, res, next) => {
  console.log(req.user);
  if (req.user.role !== 'admin') {
    return res.status(401).json({ error: 'Not authorized' });
  }
  next();
});

//get all users
router.get('/', async (req, res) => {
  try {
    const response = await getUserTaskData();
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

//delete task of specific user
router.delete('/:id/:taskid', async (req, res) => {
  const { taskid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskid)) {
    return res.status(404).json({ error: 'No such task' });
  }

  const task = await Task.findOneAndDelete({ _id: taskid });

  if (!task) {
    return res.status(400).json({ error: 'No such task' });
  }

  res.status(200).json(task);
});

//update task of specific user
router.patch('/:id/:taskid', async (req, res) => {
  const { taskid } = req.params;
  console.log(taskid);
  if (!mongoose.Types.ObjectId.isValid(taskid)) {
    return res.status(404).json({ error: 'No such task' });
  }

  const task = await Task.findOneAndUpdate(
    { _id: taskid },
    {
      ...req.body,
    },
    { new: true }
  );

  if (!task) {
    return res.status(400).json({ error: 'No such task' });
  }

  res.status(200).json(task);
});

const getUserTaskData = async () => {
  try {
    const taskData = await Task.aggregate([
      {
        $group: {
          _id: '$assignedUser',
          count: { $sum: 1 },
          tasks: { $push: '$$ROOT' },
        },
      },
    ]);

    const userIds = taskData.map((data) => data._id);
    const userData = await User.find({ email: { $in: userIds } });

    const userTaskData = taskData.map((data) => {
      const user = userData.find((user) => user.email === data._id);
      return {
        ...data,
        user,
      };
    });
    return userTaskData;
  } catch (error) {
    console.error('Error retrieving user task data:', error);
  }
};
module.exports = router;
