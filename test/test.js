const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Import your app.js file
const Task = require('../models/Task');
const User = require('../models/User');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Task and User Routes', () => {
  beforeEach(async () => {
    // Clear the database before each test
    await Task.deleteMany({});
    await User.deleteMany({});
  });

  // Task routes test cases
  describe('Task Routes', () => {
    it('GET /v1/tasks should return an empty array when there are no tasks', async () => {
      const res = await chai.request(app).get('/v1/tasks');
      expect(res).to.have.status(200);
      expect(res.body.tasks).to.be.an('array');
      expect(res.body.tasks).to.have.lengthOf(0);
    });

    it('POST /v1/tasks should create a new task', async () => {
      const res = await chai
        .request(app)
        .post('/v1/tasks')
        .send({ title: 'Test Task' });

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('id');
      const task = await Task.findById(res.body.id);
      expect(task).to.exist;
      expect(task.title).to.equal('Test Task');
      expect(task.is_completed).to.be.false;
    });

    it('GET /v1/tasks/:id should return a specific task by id', async () => {
      const task = await new Task({ title: 'Test Task' }).save();

      const res = await chai.request(app).get(`/v1/tasks/${task._id}`);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('title', 'Test Task');
      expect(res.body).to.have.property('is_completed', false);
    });

    it('GET /v1/tasks/:id should return a 404 error if task is not found', async () => {
      const res = await chai.request(app).get('/v1/tasks/615153e9a15f6a4df84b1f95');
      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error', 'There is no task at that id');
    });

    it('PUT /v1/tasks/:id should edit the title and is_completed of a task', async () => {
      const task = await new Task({ title: 'Test Task' }).save();
      const res = await chai
        .request(app)
        .put(`/v1/tasks/${task._id}`)
        .send({ title: 'Updated Task', is_completed: true });

      expect(res).to.have.status(204);
      const updatedTask = await Task.findById(task._id);
      expect(updatedTask.title).to.equal('Updated Task');
      expect(updatedTask.is_completed).to.be.true;
    });

    it('PUT /v1/tasks/:id should return a 404 error if task is not found', async () => {
      const res = await chai
        .request(app)
        .put('/v1/tasks/615153e9a15f6a4df84b1f95')
        .send({ title: 'Updated Task', is_completed: true });

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error', 'There is no task at that id');
    });

    it('DELETE /v1/tasks/:id should delete a specific task', async () => {
      const task = await new Task({ title: 'Test Task' }).save();
      const res = await chai.request(app).delete(`/v1/tasks/${task._id}`);
      expect(res).to.have.status(204);

      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).to.be.null;
    });

    it('DELETE /v1/tasks/:id should return a 404 error if task is not found', async () => {
      const res = await chai.request(app).delete('/v1/tasks/615153e9a15f6a4df84b1f95');
      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error', 'There is no task at that id');
    });

    it('POST /v1/tasks/bulk should bulk add tasks', async () => {
      const tasksToAdd = [
        { title: 'Task 1' },
        { title: 'Task 2', is_completed: true },
        { title: 'Task 3', is_completed: false },
      ];

      const res = await chai.request(app).post('/v1/tasks/bulk').send({ tasks: tasksToAdd });
      expect(res).to.have.status(201);
      expect(res.body.tasks).to.be.an('array');
      expect(res.body.tasks).to.have.lengthOf(3);
      expect(res.body.tasks[0]).to.have.property('id');
      expect(res.body.tasks[1]).to.have.property('id');
      expect(res.body.tasks[2]).to.have.property('id');

      const allTasks = await Task.find({});
      expect(allTasks).to.have.lengthOf(3);
    });

    it('DELETE /v1/tasks/bulk should bulk delete tasks', async () => {
      const task1 = await new Task({ title: 'Task 1' }).save();
      const task2 = await new Task({ title: 'Task 2' }).save();
      const task3 = await new Task({ title: 'Task 3' }).save();

      const tasksToDelete = [task1._id, task2._id, task3._id];

      const res = await chai.request(app).delete('/v1/tasks/bulk').send({ tasks: tasksToDelete });
      expect(res).to.have.status(204);

      const remainingTasks = await Task.find({});
      expect(remainingTasks).to.have.lengthOf(0);
    });
  });

  // User routes test cases
  describe('User Routes', () => {
    it('GET /v1/users should return an empty array when there are no users', async () => {
      const res = await chai.request(app).get('/v1/users');
      expect(res).to.have.status(200);
      expect(res.body.users).to.be.an('array');
      expect(res.body.users).to.have.lengthOf(0);
    });

    it('POST /v1/users should create a new user', async () => {
      const res = await chai
        .request(app)
        .post('/v1/users')
        .send({ username: 'TestUser', role: 'user' });

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('id');
      const user = await User.findById(res.body.id);
      expect(user).to.exist;
      expect(user.username).to.equal('TestUser');
      expect(user.role).to.equal('user');
    });

    it('GET /v1/users/:id should return a specific user by id', async () => {
      const user = await new User({ username: 'TestUser', role: 'user' }).save();

      const res = await chai.request(app).get(`/v1/users/${user._id}`);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('username', 'TestUser');
      expect(res.body).to.have.property('role', 'user');
    });

    it('GET /v1/users/:id should return a 404 error if user is not found', async () => {
      const res = await chai.request(app).get('/v1/users/615153e9a15f6a4df84b1f95');
      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error', 'User not found');
    });

    it('PUT /v1/users/:id should edit the role of a user', async () => {
      const user = await new User({ username: 'TestUser', role: 'user' }).save();
      const res = await chai
        .request(app)
        .put(`/v1/users/${user._id}`)
        .send({ role: 'admin' });

      expect(res).to.have.status(204);
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.role).to.equal('admin');
    });

    it('PUT /v1/users/:id should return a 404 error if user is not found', async () => {
      const res = await chai
        .request(app)
        .put('/v1/users/615153e9a15f6a4df84b1f95')
        .send({ role: 'admin' });

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error', 'User not found');
    });

    it('DELETE /v1/users/:id should delete a specific user', async () => {
      const user = await new User({ username: 'TestUser', role: 'user' }).save();
      const res = await chai.request(app).delete(`/v1/users/${user._id}`);
      expect(res).to.have.status(204);

      const deletedUser = await User.findById(user._id);
      expect(deletedUser).to.be.null;
    });

    it('DELETE /v1/users/:id should return a 404 error if user is not found', async () => {
      const res = await chai.request(app).delete('/v1/users/615153e9a15f6a4df84b1f95');
      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error', 'User not found');
    });
  });
});
