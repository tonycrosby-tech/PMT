const router = require('express').Router();
const User = require('../../models/User');
const project = require('../../models/Project');
const Task = require('../../models/Task');
const passport = require('passport');
var parser = require('body-parser');
var urlencodedParser = parser.urlencoded({ extended: false });
const authController = require('../../controllers/auth');
const isAuthenticated = require('../../config/middleware/isAuthenticated');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../models');

// api/auth/register
// output: registered user, send back email and username, and id of user
router.post('/register', function(req, res) {
  Users = new User({ email: req.body.email, username: req.body.username });

  User.register(Users, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message:
          'Your account could not be saved. You need a unique email probably: ',
        err,
      });
    } else {
      res.json({
        user,
      });
    }
  });
});

//api/auth/user/:id
// find user by id
// input: id
// output: one user

// router.get("/user/:id", function(req, res) {
//   const ider = req.user.id;
//   User.findOne(ider)
//     .then((user) => res.json(user))
//     .catch((err) => res.status(439).json(err));
// });

router.get('/user', isAuthenticated, (req, res) => {
  User.find(req.username);
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});

router.get('/task/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, task });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message });
  }
});

//api/auth/users  : all users
// input: nothing
// output: all users, no projects

router.get('/users', isAuthenticated, function(req, res) {
  const test = req.user;
  User.find(req.query)
    .then((user) => res.json(user))
    .catch((err) => res.status(439).json(err));
});

// get all projects not attached to any user
// router.get('/getAll', isAuthenticated, async (req, res) => {
// try {
//   console.log(req)
//   const userId = req.userId
//   const projects = await project.find().populate('tasks'); // Only fetch user's projects
//   res.json(projects);
// } catch (err) {
//   res.status(500).json({ error: err.message }); // Use a standard status code
// }
// });

router.get('/getAllprojects', isAuthenticated, async (req, res) => {
  try {
    const ownerId = req.user._id;
    const projects = await project.find({ ownerId: ownerId }).populate(); // Only fetch user's projects
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Use a standard status code
  }
});

router.get('/getAllprojectsandtasks', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    const projects = await project.find({ ownerId: userId }).populate('tasks'); // Only fetch user's projects
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Use a standard status code
  }
});

// pass the project id in the body
// input: project id in the body
// output: deleted project id in the user document: note: this does deletes both the
// pointer and project record
// {
//   "project_id": "603534a5aeb8367228ef6ff4"
// }
router.delete('/deleteproject/:id', isAuthenticated, function(req, res) {
  const ider = req.user.id;

  project.deleteOne({ _id: req.params.id }, function(err) {
    if (err) {
      res.status(401).send({
        success: false,
        msg: 'Deletion failed. project not found.',
      });
    } else {
      User.updateOne(
        { _id: ider },
        { $pull: { projects: req.params.id } },
        function(err, result) {
          if (err) {
            res.status(401).send({
              success: false,
              msg: 'Deletion failed. project not found.',
            });
          } else {
            // now go delete actual project record
            res.json(result);
          }
        }
      );
    }
  });
});

router.delete('/deletetask/:projectId/:taskId', isAuthenticated, async function(
  req,
  res
) {
  const { projectId, taskId } = req.params;
  const userId = req.user.id;

  try {
    // First, remove the task from the project's tasks array
    const updatedProject = await project.findByIdAndUpdate(
      projectId,
      { $pull: { tasks: taskId } }, // Remove taskId from tasks array
      { new: true } // Returns the updated document
    );

    if (!updatedProject) {
      return res
        .status(404)
        .json({ success: false, msg: 'Project not found.' });
    }

    // If tasks are stored separately, remove the task document from the task collection
    await Task.findByIdAndDelete(taskId); // Assuming Task is your task model

    res.json({ success: true, updatedProject });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, msg: 'Server error while deleting task.' });
  }
});

router.post('/tasks', isAuthenticated, async (req, res) => {
  const { title, description, projectId } = req.body;

  const newTask = new Task({
    title,
    description,
    projectId,
  });

  try {
    const savedTask = await newTask.save();
    // Update the project to include the new task
    await project.findByIdAndUpdate(projectId, {
      $push: { tasks: savedTask._id },
    });
    res.status(201).json({ success: true, task: savedTask });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ success: false, message: 'Error creating task.' });
  }
});

// api/auth/project--add a project
// this takes a username and a project, saves the project,
// and returns the username, email, and ids of the projects that
//are attached to the user
// input: project properties you want to insert  (see model for specifics)
// output: a new project with a pointer in the user document; you get
// the user and the pointer(s) to the project(s). Go to Robo3T to see new project
// {
//   "projectName": "wh7799at",
//   "startDate": "2021-02-05",
//   "cost": "50",
//   "expirationDate": "2021-02-22"
// }
router.post('/project/add', isAuthenticated, async (req, res) => {
  const newProject = new project({ ...req.body, ownerId: req.user._id });
  console.log('Request body:', req.body);
  try {
    const project = await newProject.save();

    // Update the user to include this new project ID
    await User.findByIdAndUpdate(req.user.id, {
      $push: { projects: project._id },
    });

    res.json({ success: true, project });
  } catch (err) {
    console.error('Error saving project:', err);
    res.status(400).json({
      success: false,
      message: 'Failed to add project',
      error: err.message,
    });
  }
});

// creates a project WITHOUT being tied to the user.
// Input: properties of the project
// {
//   "projectName" : "whatever",
//   "cost": 100,
//   "startDate": "2021-02-01",
//   "expirationDate": "2021-05-01"
// }
router.post('/projects', isAuthenticated, function(req, res) {
  project
    .create(req.body)

    .then((result) => {
      res.json(result);
    })
    .catch((err) => res.status(439).json(err));
});

router.post('/tasks', isAuthenticated, async (req, res) => {
  const newTask = new Task(req.body);

  try {
    const task = await newTask.save();

    // Update the project to include this new task ID
    await Project.findByIdAndUpdate(req.body.projectId, {
      $push: { tasks: task._id },
    });

    res.json({ success: true, task });
  } catch (err) {
    console.error('Error saving task:', err);
    res.status(400).json({
      success: false,
      message: 'Failed to add task',
      error: err.message,
    });
  }
});
//api/auth/getAll--get all users and projects
// get all users with pointers to projects
router.get('/getAll', isAuthenticated, function(req, res) {
  User.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });
});

//api/auth/getAll--get all users and projects
// get all users with pointers to projects
// router.get('/getAllprojectsandtasks', isAuthenticated, function(req, res) {
//   project
//     .find() // Fetch all projects
//     .populate('tasks') // Populate the tasks field for each project
//     .then((projects) => {
//       res.json(projects); // Send the projects with populated tasks
//     })
//     .catch((error) => {
//       res.status(500).json({ error });
//     });
// });

// given the user id, get all of its projects
// input: none
// output: values of projects

//api/auth/getAllUsersAndProjects--get all users and projects
// given nothing, get all of the users and their projects
// this will populate the projects
router.get('/getAllUsersAndProjects', isAuthenticated, function(req, res) {
  User.find()
    .populate('projects')
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

//api/auth/updateSub with key of the project in the uri and the desired
// updated value of satisfaction
// input: key of the project and value of satisfaction we want to update to
// output: updated project
// {
//   "satisfaction" : 39
// }
router.put('/updateProjectSat/:id', isAuthenticated, function(req, res) {
  const setter = { satisfaction: req.body.satisfaction };
  Project.findOneAndUpdate(
    { _id: req.params.id },
    setter,
    { returnOriginal: false },
    (err, result) => {
      if (err) {
        res.status(439).json(err);
      } else {
        res.json(result);
      }
    }
  );
});

//api/auth/updateSub with key of the project in the uri and value of updated cost in the body
// input: id of project and value of cost
// output: updated project
// {
//   "cost" : 60

//api/auth/updateSubDateExp with key of the project in the uri and value of updated expiration date in the body
// input: id of project and value of cost
// output: updated project (expiration date)
// {
//   "expirationDate" : "2021-05-01"
// }
router.put('/updateProjectDateExp/:id', isAuthenticated, function(req, res) {
  const ider = req.params.id;
  const setter = { expirationDate: req.body.expirationDate };
  Project.findOneAndUpdate(
    { _id: ider },
    setter,
    { returnOriginal: false },
    (err, result) => {
      if (err) {
        res.status(439).json(err);
      } else {
        res.json(result);
      }
    }
  );
});

// update all properties, except creation date, in one fell swoop
//input: id of project in params and values to update the project with in the body.
// {

//   "projectName": "newone",
//   "cost": "900",
//   "expirationDate": "2022-01-01",
//   "startDate": "2021-01-01"
// }
router.put('/updateAllPropsForOneProject/:id', isAuthenticated, function(
  req,
  res
) {
  const ider = req.params.id;
  const setter = { $set: req.body };
  Project.findOneAndUpdate(
    { _id: ider },
    setter,
    { returnOriginal: false },
    (err, result) => {
      if (err) {
        res.status(439).json(err);
      } else {
        res.json(result);
      }
    }
  );
});

// projectName: {type: String, required: true, unique: false},
//     cost: {type: Number, required: false, unique: false},
//     // rating: {type: Number, required: false, unique: false},
//     dateCreated: {type: Date, default: Date.now},
//     expirationDate: {type: String, required:true},
//     startDate: {type: String, required:true},

//api/auth/login
// input: username and password
// output: authenticated password and found username
router.route('/login').post(authController.login);

// input: id of project
// {
//   "project": "60345e075b196f6a3414815b"
// }
router.put('/addProjectAlreadyExistToUser', isAuthenticated, function(
  req,
  res
) {
  const filter = { _id: req.user.id };

  User.findOneAndUpdate(
    filter,
    { $push: { projects: req.body.project } },
    { new: true }
  )
    .then((result) => {
      res.json(result);
    })
    .catch((err) => res.status(439).json(err));
});

router.route('/logout').get(authController.logout);

// router.get("/", (req, res) => {
//   console.log("===== user!!======");
//   console.log(req.user);
//   if (req.user) {
//     res.json({ user: req.user });
//   } else {
//     res.json({ user: null });
//   }
// });

module.exports = router;
