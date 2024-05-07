import { projectExists } from "../utils/localStorageHelpers";

const createProject = (name, isNewlyCreated = true) => {
  if (isNewlyCreated && projectExists(name))
    throw new Error(`Project with name, "${name}" already exists`);

  const tasks = [];
  const getTasks = () => [...new Set(tasks)];

  const getName = () => name;
  const viewDetails = () => ({
    name,
    tasks: getTasks(),
  });

  // accepts 1+ task objects. we only need tasks' details in project, not
  const addTasks = (...taskObjectsForAdding) => {
    const taskObjects = taskObjectsForAdding.flat(1);
    // ? should we reconstruct every task object first so this check is no longer required + we get to actually ensure the properties are private and only manipulable through defined methods?

    taskObjects.forEach((t) => {
      const taskDetails = t.hasOwnProperty("viewDetails") ? t.viewDetails() : t;
      tasks.push(taskDetails);
    });
  };

  return { viewDetails, getName, getTasks, addTasks };
};

const createProjectFromJSON = (retrievedProject) => {
  const reconstructedProject = createProject(retrievedProject.name, false);
  reconstructedProject.addTasks(retrievedProject.tasks);
  return reconstructedProject;
};

export { createProject, createProjectFromJSON };

//TODO: deduplicate tasks within a project
