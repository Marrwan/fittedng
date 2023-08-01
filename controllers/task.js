const { default: mongoose } = require("mongoose");
const Task = require("../models/Task");

module.exports.createTask = async (req, res) => {
  try {
    const { tasks } = req.body;
  
    // If tasks is an array, it means it's a bulk task creation request
  
    if (Array.isArray(tasks)) {
      // Insert all tasks in the array into the database
      const createdTasks = await Task.insertMany(tasks);
      const ids = createdTasks.map((task) => ({ id: task._id }));
      res.status(201).json({ tasks: ids });
    } else {
      // If tasks is not an array, it means it's a single task creation request
      const { title } = req.body;
      // if task is empty, return task cannot be empty
      if(!title || title.trim() === '')
        return res.status(404).json({ error: "Task title cannot be empty"})

      const task = new Task({ title });
      const savedTask = await task.save();
      res.status(201).json({ id: savedTask._id });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message : err.message });
  }
};
module.exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({});
    console.log(tasks.length)
    res.status(200).json({ tasks });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports.getTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({
        error: "There is no task at that id",
      });
    const task = await Task.findById(id);

    if (!task) {
      res.status(404).json({ error: "There is no task at that id" });
    } else {
      res.status(200).json(task);
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error" });
  }
};
module.exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({
        error: "There is no task at that id",
      });
      // const task = await Task.findById(id);

      // if (!task) {
      //   return res.status(404).json({ error: "There is no task at that id" });
      // } 
    await Task.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error',  });
  }
}
module.exports.editTask = async (req, res) => {
  try {
    const { title, is_completed } = req.body;
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({
        error: "There is no task at that id",
      });
    const task = await Task.findByIdAndUpdate(
      id,
      { title, is_completed },
      { new: true }
    );
    if (!task) {
      res.status(404).json({ error: 'There is no task at that id' });
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
module.exports.bulkDelete = async (req, res) => {
  try {
    const { tasks } = req.body;
    // await Task.deleteMany({ _id: { $in: tasks } });
    await Task.deleteMany({ _id: { $in: tasks.map((task) => task.id) } });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}