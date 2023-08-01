const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const taskController = require('../controllers/task');



router.route('/tasks')
.get(auth.isAdmin, taskController.getTasks)

// Create a new Task
.post(auth.isAdmin,taskController.createTask)

// Bulk delete tasks
.delete(auth.isAdmin,taskController.bulkDelete);

router.route('/tasks/:id')
// Get a specific task by id
.get(auth.isAdmin,taskController.getTask)

// Delete a specific task by id
.delete(auth.isAdmin,taskController.deleteTask)

// Edit the title or completion of a specific task by id
.put(auth.isAdmin,taskController.editTask);



module.exports = router;