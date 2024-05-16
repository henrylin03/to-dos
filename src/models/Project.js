import { uniq, isEqual } from "lodash";
import { projectExists } from "../helpers/localStorageHelpers";

const createProject = (name, recreatingFromJSON = false) => {
  if (!recreatingFromJSON && projectExists(name))
    throw new Error(`Project with name, "${name}" already exists`);

  // we presume you can't create a project at the exact same time
  let id = Date.now();
  let tasks = [];

  // GETTERS
  const getTasks = () => _.uniqWith(tasks, _.isEqual); // tasks are deduplicated
  const getName = () => name;
  const viewDetails = () => ({ id, name, tasks: getTasks() });

  // SETTERS (kind of)
  // don't use this setter for id unless you're reconstructing from json
  const setId = (newId) => (id = newId);
  const addTasks = (...taskObjectsForAdding) => {
    const taskObjects = taskObjectsForAdding.flat(Infinity);

    taskObjects.forEach((t) => {
      const taskDetails = t.hasOwnProperty("viewDetails") ? t.viewDetails() : t;
      tasks.push(taskDetails);
    });
  };

  const replaceTasks = (tasksArray) => (tasks = tasksArray);

  // STORER INTO LOCALSTORAGE
  const store = () => localStorage.setItem(name, JSON.stringify(viewDetails()));

  return {
    viewDetails,
    getName,
    getTasks,
    setId,
    addTasks,
    replaceTasks,
    store,
  };
};

const recreateRetrievedProject = ({ id, name, tasks }) => {
  const project = createProject(name, true);
  project.setId(id);
  project.replaceTasks(tasks);

  console.log(project);

  return project;
};

export { createProject, recreateRetrievedProject };
