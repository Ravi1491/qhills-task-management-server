const express = require("express");
const router = express.Router();
const users = require("../../database/models").user;
const tasks = require("../../database/models").task;
const taskUsers = require("../../database/models").taskuser;
const authenticateToken = require('../middlewares/authenticateToken');
const { where } = require("sequelize");
const task = require("../../database/models/task");

router.get('/getAllUserTasks', authenticateToken, async (req, res) => {
  try {
    const user = req.user; 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const allUserTasks = await taskUsers.findAll({
      where: { userId: user.id }, 
      attributes: [ 'taskId'],
    });

    if(!allUserTasks || allUserTasks.length === 0) {
      return res.status(400).json({ message: 'Notasks found for the user'});
    }
    const taskIds = allUserTasks.map(allUserTask => allUserTask.taskId);

    const finalTasks = await tasks.findAll({
      where: { id:taskIds },
      include: [
        {
          model: users,
          attributes: ['id', 'name'],
        },
      ],
    });

    return res.status(200).json(finalTasks);
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/getTaskInfo', authenticateToken, async (req, res) => {
  try {
    const user = req.user; 
    const taskId = req.query.taskId;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!taskId) {
      return res.status(400).json({ message: 'Task ID is required' });
    }

    console.log('Query Parameters:', req.query); 
    console.log(`Fetching task with ID: ${taskId}`); 

    const task = await tasks.findByPk(taskId, {
      include: [{
        model: users,
        attributes: ['name'], // Include only necessary user attributes
        through: {
          attributes: [] // Exclude any additional attributes from the join table
        }
      }],
      attributes: ['id', 'name', 'description', 'priority', 'dueDate'], // Task attributes
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task information:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/create', async (req, res) => {
  const { name, description, priority, dueDate, userIds } = req.body;

  try {
      // Validate input
      const errors = [];
      if (!name) errors.push('Name is required');
      if (!priority) errors.push('Priority is required');
      if (!dueDate) errors.push('Due date is required');
      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
          errors.push('User IDs array is required and must not be empty');
      }

      if (errors.length > 0) {
          return res.status(400).json({ errors });
      }

      // Create the task
      const task = await tasks.create({
          name,
          description,
          priority,
          dueDate
      });

      // If there are userIds, associate users with the task
      const user = await users.findAll({
          where: {
              id: userIds
          }
      });

      // Check if all userIds were found
      const foundUserIds = user.map(user => user.id);
      const notFoundUserIds = userIds.filter(id => !foundUserIds.includes(id));

      if (notFoundUserIds.length > 0) {
          await task.destroy(); // Rollback task creation if any user is not found
          return res.status(404).json({ errors: notFoundUserIds.map(id => `User with ID ${id} not found`) });
      }

      await task.addUsers(user);

      res.status(201).json({ task });
  } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Error creating task' });
  }
});

router.get('/getNotification', authenticateToken, async (req, res) => {
  try {
    const user = req.user; // Assuming req.user contains user information from token

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const task = await tasks.findAll({
      include: [{
        model: users,
        where: { id: user.id },
        attributes: ['name'], // Include only necessary user attributes
        through: {
          attributes: [] // Exclude any additional attributes from the join table
        }
      }],
      attributes: ['name', 'description', 'priority', 'dueDate'], // Task attributes
    });

    return res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching assigned tasks for notification:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/myAccount', authenticateToken, async (req, res) => {
    try {
        const user = req.user; 

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { name, phonenumber } = user;

        return res.status(200).json({ 
            name, 
            phonenumber
        });
    } catch (error) {
        console.error('Error fetching account details:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/taskList', authenticateToken, async (req, res) => {
  try {
    const user = req.user; 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const task = await tasks.findAll({
      include: [{
        model: users,
        where: { id: user.id },
        attributes: []  
      }],
      attributes: ['name', 'description', 'priority', 'dueDate']
    });

    return res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;