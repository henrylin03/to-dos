import { projectExists } from "../helpers/localStorageHelpers";
import { recreateTaskFromJSON } from "./Task";

const createProject = (name, recreatingFromJSON = false) => {
  if (!recreatingFromJSON && projectExists(name))
    throw new Error(`Project with name, "${name}" already exists`);

  // we presume you can't create a project at the exact same time
  let id = Date.now();
  let taskObjects = [];

  // GETTERS
  const getTasksAsObjects = () => taskObjects;
  const getTaskDetails = () => taskObjects.map((t) => t.viewDetails());
  const getName = () => name;
  const viewDetails = () => ({
    id,
    name,
    tasks: getTaskDetails(),
  });

  // SETTERS (kind of)
  const setId = (newId) => {
    if (!recreatingFromJSON)
      throw new Error(
        "Cannot update the ID of a project unless you're recreating it from localStorage in JSON format."
      );
    id = newId;
  };
  const addTask = (taskObject) => taskObjects.push(taskObject);
  const replaceTasks = (newArrayOfTaskObjects) =>
    (taskObjects = newArrayOfTaskObjects);

  // STORER INTO LOCALSTORAGE
  const store = () => localStorage.setItem(name, JSON.stringify(viewDetails()));

  return {
    viewDetails,
    getName,
    getTaskDetails,
    getTasksAsObjects,
    setId,
    addTask,
    replaceTasks,
    store,
  };
};

const recreateProjectFromJSON = ({ id, name, tasks }) => {
  const project = createProject(name, true);
  project.setId(id);

  const tasksReconstructed = tasks.map((t) => recreateTaskFromJSON(t));
  project.replaceTasks(tasksReconstructed);

  return project;
};

export { createProject, recreateProjectFromJSON };
