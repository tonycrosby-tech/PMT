// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { FaUserCircle } from 'react-icons/fa';
// import axios from 'axios';

// const Project = () => {
//   const [open, setOpen] = useState(false);
//   const [projects, setProjects] = useState([]);
//   const [projectId, setProjectId] = useState('');
//   const [ownerId, setOwnerId] = useState('');
//   const [projectName, setProjectName] = useState('');
//   const [description, setDescription] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [expirationDate, setExpirationDate] = useState('');
//   const [taskModalOpen, setTaskModalOpen] = useState(false);
//   const [taskTitle, setTaskTitle] = useState('');
//   const [taskDescription, setTaskDescription] = useState('');
//   const [taskStatus, setTaskStatus] = useState('To Do');

//     const [dropdownOpen, setDropdownOpen] = useState(false);

//     const toggleDropdown = () => {
//       setDropdownOpen(!dropdownOpen);
//     };

//   useEffect(() => {
//     loadProjects();
//     fetchAll();
//   }, []);

//   const fetchAll = async () => {
//     try {
//       const response = await axios.get('/api/auth/getAll');
//       setOwnerId(response.data[0]._id);
//     } catch (err) {
//       console.error('Error loading projects:', err);
//     }
//   };

//   const handleAddProject = async (e) => {
//     e.preventDefault();
//     const newProject = {
//       title: projectName,
//       description,
//       startDate,
//       ownerId,
//       expirationDate,
//     };

//     try {
//       const response = await axios.post('/api/auth/project/add', newProject);
//       if (response.data.success) {
//         loadProjects();
//         handleClose();
//       }
//     } catch (error) {
//       console.error('Error adding project:', error);
//     }
//   };

//   const handleAddTask = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('/api/auth/tasks', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           title: taskTitle,
//           description: taskDescription,
//           projectId,
//         }),
//       });

//       const data = await response.json();
//       if (data.success) {
//         loadProjects();
//         setTaskModalOpen(false);
//         resetTaskFields();
//       }
//     } catch (error) {
//       console.error('Error adding task:', error);
//     }
//   };

//   const deleteProject = async (id) => {
//     try {
//       await axios.delete(`/api/auth/deleteProject/${id}`);
//       loadProjects();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const deleteTask = async (projectId, taskId) => {
//     try {
//       await axios.delete(`/api/auth/deletetask/${projectId}/${taskId}`);
//       loadProjects();
//     } catch (error) {
//       console.error('Error deleting task:', error);
//     }
//   };

//   const handleOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     resetProjectFields();
//   };

//   const resetProjectFields = () => {
//     setProjectName('');
//     setDescription('');
//     setStartDate('');
//     setExpirationDate('');
//   };

//   const resetTaskFields = () => {
//     setTaskTitle('');
//     setTaskDescription('');
//   };

//   const loadProjects = async () => {
//     try {
//       const response = await axios.get('/api/auth/getAllprojectsandtasks');
//       console.log('Fetched Projects:', response.data); // Check the output
//       setProjects(response.data);
//     } catch (err) {
//       console.error('Error loading projects:', err);
//     }
//   };

//   return (
//     <>
//       <nav className="bg-blue-600 p-4">
//         <div className="container mx-auto flex justify-between items-center">
//           <Link to="/home" className="text-white text-2xl font-bold">
//             Project Management Tool
//           </Link>


//           <Link to="/profile" className="text-white text-2xl">
//             <FaUserCircle />
//           </Link>
//         </div>
//       </nav>

//       <div className="container mx-auto p-4">
//         <h1 className="text-3xl text-center font-bold mb-6">
//           EZ Tracker - Projects
//         </h1>
//         <div className="mb-4 flex justify-between items-center">
//           <h2 className="text-xl font-semibold">Projects</h2>
//           <button
//             onClick={handleOpen}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition duration-200"
//           >
//             Add a New Project
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {projects.map((proj) => (
//             <div
//               key={proj._id}
//               className="bg-white rounded-lg shadow-md p-4 transition-transform transform hover:scale-105"
//             >
//               <h3 className="text-xl font-bold">{proj.title}</h3>
//               <p className="text-gray-600 mb-2">{proj.description}</p>
//               <p className="text-gray-700">
//                 Start Date: {new Date(proj.startDate).toLocaleDateString()}
//               </p>
//               <p className="text-gray-700">
//                 Due Date: {new Date(proj.expirationDate).toLocaleDateString()}
//               </p>
//               <div className="mt-4">
//                 <h4 className="font-semibold">Tasks:</h4>
//                 {proj.tasks && proj.tasks.length > 0 ? (
//                   proj.tasks.map((task) => (
//                     <div key={task._id} className="border p-2 mb-2 rounded">
//                       <p className="font-bold">{task.title}</p>
//                       <p>{task.description}</p>
//                       <p>Status: {task.status}</p>
//                       <button
//                         onClick={() => deleteTask(proj._id, task._id)}
//                         className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
//                       >
//                         Delete Task
//                       </button>
//                     </div>
//                   ))
//                 ) : (
//                   <p>No tasks available</p>
//                 )}
//               </div>
//               <div className="flex justify-between mt-4">
//                 <button
//                   onClick={() => {
//                     setProjectId(proj._id);
//                     setTaskModalOpen(true);
//                   }}
//                   className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
//                 >
//                   Add Task
//                 </button>
//                 <button
//                   onClick={() => deleteProject(proj._id)}
//                   className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Modal for adding new project */}
//         {open && (
//           <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
//             <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 md:w-1/3">
//               <h2 className="text-xl font-semibold mb-4">Add New Project</h2>
//               <form onSubmit={handleAddProject}>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 mb-2">
//                     Project Name
//                   </label>
//                   <input
//                     type="text"
//                     className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                     value={projectName}
//                     onChange={(e) => setProjectName(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 mb-2">
//                     Description
//                   </label>
//                   <textarea
//                     className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 mb-2">Start Date</label>
//                   <input
//                     type="date"
//                     className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 mb-2">Due Date</label>
//                   <input
//                     type="date"
//                     className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                     value={expirationDate}
//                     onChange={(e) => setExpirationDate(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="flex justify-end">
//                   <button
//                     type="submit"
//                     className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
//                   >
//                     Add Project
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleClose}
//                     className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Task Modal */}
//         {taskModalOpen && (
//           <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
//             <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 md:w-1/3">
//               <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
//               <form onSubmit={handleAddTask}>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 mb-2">Task Title</label>
//                   <input
//                     type="text"
//                     className="border border-gray-300 rounded w-full p-2"
//                     value={taskTitle}
//                     onChange={(e) => setTaskTitle(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 mb-2">
//                     Description
//                   </label>
//                   <textarea
//                     className="border border-gray-300 rounded w-full p-2"
//                     value={taskDescription}
//                     onChange={(e) => setTaskDescription(e.target.value)}
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 mb-2">Status</label>
//                   <select
//                     className="border border-gray-300 rounded w-full p-2"
//                     value={taskStatus}
//                     onChange={(e) => setTaskStatus(e.target.value)}
//                   >
//                     <option value="To Do">To Do</option>
//                     <option value="In Progress">In Progress</option>
//                     <option value="Done">Done</option>
//                   </select>
//                 </div>
//                 <div className="flex justify-end">
//                   <button
//                     type="submit"
//                     className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                   >
//                     Add Task
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setTaskModalOpen(false)}
//                     className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Project;

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { FaUserCircle } from 'react-icons/fa';
// import axios from 'axios';

// const Project = () => {
//   const [open, setOpen] = useState(false);
//   const [projects, setProjects] = useState([]);
//   const [projectDetails, setProjectDetails] = useState({
//     id: '',
//     name: '',
//     description: '',
//     startDate: '',
//     expirationDate: '',
//   });
//   const [taskModalOpen, setTaskModalOpen] = useState(false);
//   const [taskDetails, setTaskDetails] = useState({
//     title: '',
//     description: '',
//     status: 'To Do',
//     projectId: '',
//   });
//   const [ownerId, setOwnerId] = useState('');

//   useEffect(() => {
//     loadProjects();
//     fetchOwnerId();
//   }, []);

//   const fetchOwnerId = async () => {
//     try {
//       const response = await axios.get('/api/auth/getAll');
//       setOwnerId(response.data[0]._id);
//     } catch (err) {
//       console.error('Error loading owner ID:', err);
//     }
//   };

//   const loadProjects = async () => {
//     try {
//       const response = await axios.get('/api/auth/getAllprojectsandtasks');
//       setProjects(response.data);
//     } catch (err) {
//       console.error('Error loading projects:', err);
//     }
//   };

//   const handleAddProject = async (e) => {
//     e.preventDefault();
//     const newProject = { ...projectDetails, ownerId };
//     try {
//       const response = await axios.post('/api/auth/project/add', newProject);
//       if (response.data.success) {
//         loadProjects();
//         handleClose();
//       }
//     } catch (error) {
//       console.error('Error adding project:', error);
//     }
//   };

//   const handleAddTask = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('/api/auth/tasks', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(taskDetails),
//       });
//       const data = await response.json();
//       if (data.success) {
//         loadProjects();
//         setTaskModalOpen(false);
//         resetTaskFields();
//       }
//     } catch (error) {
//       console.error('Error adding task:', error);
//     }
//   };

//   const handleDeleteProject = async (id) => {
//     try {
//       await axios.delete(`/api/auth/deleteProject/${id}`);
//       loadProjects();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDeleteTask = async (projectId, taskId) => {
//     try {
//       await axios.delete(`/api/auth/deletetask/${projectId}/${taskId}`);
//       loadProjects();
//     } catch (error) {
//       console.error('Error deleting task:', error);
//     }
//   };

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => {
//     setOpen(false);
//     resetProjectFields();
//   };

//   const resetProjectFields = () => {
//     setProjectDetails({
//       id: '',
//       name: '',
//       description: '',
//       startDate: '',
//       expirationDate: '',
//     });
//   };

//   const resetTaskFields = () => {
//     setTaskDetails({
//       title: '',
//       description: '',
//       status: 'To Do',
//       projectId: '',
//     });
//   };

//   return (
//     <>
//       <nav className="bg-blue-600 p-4 shadow">
//         <div className="container mx-auto flex justify-between items-center">
//           <Link to="/home" className="text-white text-2xl font-bold">
//             Project Management Tool
//           </Link>
//           <Link to="/profile" className="text-white text-2xl">
//             <FaUserCircle />
//           </Link>
//         </div>
//       </nav>

//       <div className="container mx-auto p-6">
//         <h1 className="text-3xl text-center font-bold mb-6">
//           EZ Tracker - Projects
//         </h1>
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Projects</h2>
//           <button
//             onClick={handleOpen}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition duration-200"
//           >
//             Add a New Project
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {projects.map((proj) => (
//             <div
//               key={proj._id}
//               className="bg-white rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105"
//             >
//               <h3 className="text-xl font-bold">{proj.title}</h3>
//               <p className="text-gray-600 mb-2">{proj.description}</p>
//               <p className="text-gray-700">
//                 Start Date: {new Date(proj.startDate).toLocaleDateString()}
//               </p>
//               <p className="text-gray-700">
//                 Due Date: {new Date(proj.expirationDate).toLocaleDateString()}
//               </p>
//               <div className="mt-4">
//                 <h4 className="font-semibold">Tasks:</h4>
//                 {proj.tasks && proj.tasks.length > 0 ? (
//                   proj.tasks.map((task) => (
//                     <div
//                       key={task._id}
//                       className="border p-2 mb-2 rounded bg-gray-50"
//                     >
//                       <p className="font-bold">{task.title}</p>
//                       <p>{task.description}</p>
//                       <p>Status: {task.status}</p>
//                       <button
//                         onClick={() => handleDeleteTask(proj._id, task._id)}
//                         className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
//                       >
//                         Delete Task
//                       </button>
//                     </div>
//                   ))
//                 ) : (
//                   <p>No tasks available</p>
//                 )}
//               </div>
//               <div className="flex justify-between mt-4">
//                 <button
//                   onClick={() => {
//                     setTaskDetails({ ...taskDetails, projectId: proj._id });
//                     setTaskModalOpen(true);
//                   }}
//                   className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
//                 >
//                   Add Task
//                 </button>
//                 <button
//                   onClick={() => handleDeleteProject(proj._id)}
//                   className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Modal for adding new project */}
//         {open && (
//           <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
//             <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 md:w-1/3">
//               <h2 className="text-xl font-semibold mb-4">Add New Project</h2>
//               <form onSubmit={handleAddProject}>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 mb-2">
//                     Project Name
//                   </label>
//                   <input
//                     type="text"
//                     className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                     value={projectDetails.name}
//                     onChange={(e) =>
//                       setProjectDetails({
//                         ...projectDetails,
//                         name: e.target.value,
//                       })
//                     }
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 mb-2">
//                     Description
//                   </label>
//                   <textarea
//                     className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                     value={projectDetails.description}
//                     onChange={(e) =>
//                       setProjectDetails({
//                         ...projectDetails,
//                         description: e.target.value,
//                       })
//                     }
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 mb-2">Start Date</label>
//                   <input
//                     type="date"
//                     className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                     value={projectDetails.startDate}
//                     onChange={(e) =>
//                       setProjectDetails({
//                         ...projectDetails,
//                         startDate: e.target.value,
//                       })
//                     }
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 mb-2">Due Date</label>
//                   <input
//                     type="date"
//                     className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                     value={projectDetails.expirationDate}
//                     onChange={(e) =>
//                       setProjectDetails({
//                         ...projectDetails,
//                         expirationDate: e.target.value,
//                       })
//                     }
//                     required
//                   />
//                 </div>
//                 <div className="flex justify-end">
//                   <button
//                     type="submit"
//                     className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
//                   >
//                     Add Project
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleClose}
//                     className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Task Modal */}
//         {taskModalOpen && (
//           <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
//             <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 md:w-1/3">
//               <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
//               <form onSubmit={handleAddTask}>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 mb-2">Task Title</label>
//                   <input
//                     type="text"
//                     className="border border-gray-300 rounded w-full p-2"
//                     value={taskDetails.title}
//                     onChange={(e) =>
//                       setTaskDetails({ ...taskDetails, title: e.target.value })
//                     }
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 mb-2">
//                     Description
//                   </label>
//                   <textarea
//                     className="border border-gray-300 rounded w-full p-2"
//                     value={taskDetails.description}
//                     onChange={(e) =>
//                       setTaskDetails({
//                         ...taskDetails,
//                         description: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 mb-2">Status</label>
//                   <select
//                     className="border border-gray-300 rounded w-full p-2"
//                     value={taskDetails.status}
//                     onChange={(e) =>
//                       setTaskDetails({ ...taskDetails, status: e.target.value })
//                     }
//                   >
//                     <option value="To Do">To Do</option>
//                     <option value="In Progress">In Progress</option>
//                     <option value="Done">Done</option>
//                   </select>
//                 </div>
//                 <div className="flex justify-end">
//                   <button
//                     type="submit"
//                     className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                   >
//                     Add Task
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setTaskModalOpen(false)}
//                     className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Project;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaTasks, FaUserCircle, FaCalendarAlt, FaChartPie } from 'react-icons/fa';
import axios from 'axios';

const Project = () => {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectDetails, setProjectDetails] = useState({
    id: '',
    name: '',
    description: '',
    startDate: '',
    expirationDate: '',
  });
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    title: '',
    description: '',
    status: 'To Do',
    projectId: '',
  });
  const [ownerId, setOwnerId] = useState('');

  useEffect(() => {
    loadProjects();
    fetchOwnerId();
  }, []);

  const fetchOwnerId = async () => {
    try {
      const response = await axios.get('/api/auth/getAll');
      setOwnerId(response.data[0]._id);
    } catch (err) {
      console.error('Error loading owner ID:', err);
    }
  };

  const loadProjects = async () => {
    try {
      const response = await axios.get('/api/auth/getAllprojectsandtasks');
      setProjects(response.data);
    } catch (err) {
      console.error('Error loading projects:', err);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    const newProject = { ...projectDetails, ownerId };
    try {
      const response = await axios.post('/api/auth/project/add', newProject);
      if (response.data.success) {
        loadProjects();
        handleClose();
      }
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskDetails),
      });
      const data = await response.json();
      if (data.success) {
        loadProjects();
        setTaskModalOpen(false);
        resetTaskFields();
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await axios.delete(`/api/auth/deleteProject/${id}`);
      loadProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (projectId, taskId) => {
    try {
      await axios.delete(`/api/auth/deletetask/${projectId}/${taskId}`);
      loadProjects();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetProjectFields();
  };

  const resetProjectFields = () => {
    setProjectDetails({
      id: '',
      name: '',
      description: '',
      startDate: '',
      expirationDate: '',
    });
  };

  const resetTaskFields = () => {
    setTaskDetails({
      title: '',
      description: '',
      status: 'To Do',
      projectId: '',
    });
  };

  return (
    <>
      {/* <nav className="bg-blue-600 p-4 shadow">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/home" className="text-white text-2xl font-bold">
            Project Management Tool
          </Link>
          <Link to="/profile" className="text-white text-2xl">
            <FaUserCircle />
          </Link>
        </div>
      </nav> */}

      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white flex flex-col">
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-6">Project Dashboard</h2>
            <nav>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="flex items-center p-2 hover:bg-gray-700 rounded"
                  >
                    <FaHome className="mr-2" /> Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center p-2 hover:bg-gray-700 rounded"
                  >
                    <FaTasks className="mr-2" /> Tasks
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center p-2 hover:bg-gray-700 rounded"
                  >
                    <FaCalendarAlt className="mr-2" /> Milestones
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center p-2 hover:bg-gray-700 rounded"
                  >
                    <FaChartPie className="mr-2" /> Reports
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-100">
          <h1 className="text-3xl font-bold mb-6">Weekly Status Report</h1>

          {/* Grid for main dashboard content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Project Status Card */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Project Status</h2>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Project</th>
                    <th>Schedule</th>
                    <th>Budget</th>
                    <th>Team</th>
                    <th>Issue</th>
                    <th>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Basic Project</td>
                    <td className="text-red-500">Red</td>
                    <td className="text-green-500">Green</td>
                    <td className="text-yellow-500">Yellow</td>
                    <td className="text-green-500">Green</td>
                    <td className="text-red-500">Red</td>
                  </tr>
                  {/* Add more rows as needed */}
                </tbody>
              </table>
            </div>

            {/* Issues By Priority Card */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Issues By Priority</h2>
              <div className="w-32 h-32 mx-auto">
                {/* Placeholder for a chart */}
                <FaChartPie className="text-gray-400 w-full h-full" />
              </div>
            </div>

            {/* Milestones Achieved */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">
                Milestones Achieved
              </h2>
              <ul className="space-y-2">
                <li>Milestone 1</li>
                <li>Milestone 2</li>
                <li>Milestone 3</li>
                {/* Add more milestones */}
              </ul>
            </div>
          </div>

          {/* Upcoming Key Activities */}
          <div className="mt-6 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">
              Upcoming Key Activities
            </h2>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Name</th>
                  <th>Planned Start</th>
                  <th>Planned Finish</th>
                  <th>Resources</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Draft Design Concepts</td>
                  <td>08-Jan-2024</td>
                  <td>14-Jan-2024</td>
                  <td>Adrian</td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>
          <div className="container mx-auto p-6">
  {/* Kanban Board */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {/* To Do Column */}
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">To Do</h2>
      <div className="space-y-4">
        {projects
          .filter((proj) => proj.status === 'To Do')
          .map((proj) => (
            <div
              key={proj._id}
              className="bg-gray-700 text-white rounded-lg shadow p-4"
            >
              <h3 className="text-lg font-semibold">{proj.title}</h3>
              <p className="text-gray-300">{proj.description}</p>
              <p className="text-sm text-gray-400">
                Start: {new Date(proj.startDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-400">
                Due: {new Date(proj.expirationDate).toLocaleDateString()}
              </p>
            </div>
          ))}
      </div>
    </div>

    {/* In Progress Column */}
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">In Progress</h2>
      <div className="space-y-4">
        {projects
          .filter((proj) => proj.status === 'In Progress')
          .map((proj) => (
            <div
              key={proj._id}
              className="bg-gray-700 text-white rounded-lg shadow p-4"
            >
              <h3 className="text-lg font-semibold">{proj.title}</h3>
              <p className="text-gray-300">{proj.description}</p>
              <p className="text-sm text-gray-400">
                Start: {new Date(proj.startDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-400">
                Due: {new Date(proj.expirationDate).toLocaleDateString()}
              </p>
            </div>
          ))}
      </div>
    </div>

    {/* In Review Column */}
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">In Review</h2>
      <div className="space-y-4">
        {projects
          .filter((proj) => proj.status === 'In Review')
          .map((proj) => (
            <div
              key={proj._id}
              className="bg-gray-700 text-white rounded-lg shadow p-4"
            >
              <h3 className="text-lg font-semibold">{proj.title}</h3>
              <p className="text-gray-300">{proj.description}</p>
              <p className="text-sm text-gray-400">
                Start: {new Date(proj.startDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-400">
                Due: {new Date(proj.expirationDate).toLocaleDateString()}
              </p>
            </div>
          ))}
      </div>
    </div>

    {/* Done Column */}
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">Done</h2>
      <div className="space-y-4">
        {projects
          .filter((proj) => proj.status === 'Done')
          .map((proj) => (
            <div
              key={proj._id}
              className="bg-gray-700 text-white rounded-lg shadow p-4"
            >
              <h3 className="text-lg font-semibold">{proj.title}</h3>
              <p className="text-gray-300">{proj.description}</p>
              <p className="text-sm text-gray-400">
                Start: {new Date(proj.startDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-400">
                Due: {new Date(proj.expirationDate).toLocaleDateString()}
              </p>
            </div>
          ))}
 
{/* 
          <div className="container mx-auto p-6">


            <div className="flex flex-wrap">
              {projects.map((proj) => (
                <div
                  key={proj._id}
                  className="bg-white rounded-lg shadow-lg p-4 m-2 w-full md:w-1/3"
                >
                  <h3 className="text-xl font-bold">{proj.title}</h3>
                  <p className="text-gray-600 mb-2">{proj.description}</p>
                  <p className="text-gray-700">
                    Start Date: {new Date(proj.startDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">
                    Due Date:{' '}
                    {new Date(proj.expirationDate).toLocaleDateString()}
                  </p>

                  <div className="mt-4">
                    <h4 className="font-semibold">Tasks:</h4>
                    {proj.tasks && proj.tasks.length > 0 ? (
                      proj.tasks.map((task) => (
                        <div
                          key={task._id}
                          className="border p-2 mb-2 rounded bg-gray-50"
                        >
                          <p className="font-bold">{task.title}</p>
                          <p>{task.description}</p>
                          <p>Status: {task.status}</p>
                          <button
                            onClick={() => handleDeleteTask(proj._id, task._id)}
                            className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                          >
                            Delete Task
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>No tasks available</p>
                    )}
                  </div>

                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => {
                        setTaskDetails({ ...taskDetails, projectId: proj._id });
                        setTaskModalOpen(true);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
                    >
                      Add Task
                    </button>
                    <button
                      onClick={() => handleDeleteProject(proj._id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal for adding new project */}
            {open && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 md:w-1/3">
                  <h2 className="text-xl font-semibold mb-4">
                    Add New Project
                  </h2>
                  <form onSubmit={handleAddProject}>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">
                        Project Name
                      </label>
                      <input
                        type="text"
                        className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={projectDetails.name}
                        onChange={(e) =>
                          setProjectDetails({
                            ...projectDetails,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={projectDetails.description}
                        onChange={(e) =>
                          setProjectDetails({
                            ...projectDetails,
                            description: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={projectDetails.startDate}
                        onChange={(e) =>
                          setProjectDetails({
                            ...projectDetails,
                            startDate: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={projectDetails.expirationDate}
                        onChange={(e) =>
                          setProjectDetails({
                            ...projectDetails,
                            expirationDate: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
                      >
                        Add Project
                      </button>
                      <button
                        type="button"
                        onClick={handleClose}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
                      >
                        Close
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Task Modal */}
            {taskModalOpen && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 md:w-1/3">
                  <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
                  <form onSubmit={handleAddTask}>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">
                        Task Title
                      </label>
                      <input
                        type="text"
                        className="border border-gray-300 rounded w-full p-2"
                        value={taskDetails.title}
                        onChange={(e) =>
                          setTaskDetails({
                            ...taskDetails,
                            title: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        className="border border-gray-300 rounded w-full p-2"
                        value={taskDetails.description}
                        onChange={(e) =>
                          setTaskDetails({
                            ...taskDetails,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Status</label>
                      <select
                        className="border border-gray-300 rounded w-full p-2"
                        value={taskDetails.status}
                        onChange={(e) =>
                          setTaskDetails({
                            ...taskDetails,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Add Task
                      </button>
                      <button
                        type="button"
                        onClick={() => setTaskModalOpen(false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
                      >
                        Close
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div> 
      </div>
      </main>
      </div>
    </>
  );
};

export default Project;