import { retrieveTasks } from "../helpers/localStorageHelpers";

const createTask = (name, recreatingFromJSON = false) => {
  let id = `T${Date.now()}`;
  let description = "";
  let dueDate = "";
  let urgency = false;
  let completed = false;
  // a task must have only one project. 'project-less' tasks go to the Inbox
  let mappedProjectId = "inbox";

  const getId = () => id;
  const getName = () => name;
  const getDescription = () => description;
  const getDueDate = () => dueDate;
  const getUrgency = () => urgency;
  const getCompleted = () => completed;
  const viewDetails = () => ({
    id,
    name,
    description,
    dueDate,
    urgency,
    completed,
  });

  const setId = (retrievedId) => {
    if (!recreatingFromJSON)
      throw new Error(
        "Cannot update the ID of a task unless you're recreating it from localStorage in JSON format."
      );
    id = retrievedId;
  };

  const setName = (newName) => (name = newName);
  const setDescription = (newDescription) => (description = newDescription);
  const setDueDate = (dueDateString) => {
    if (!dueDateString) return;
    dueDate = dueDateString;
  };
  const setUrgency = (bool) => {
    if (typeof bool != "boolean") return;
    urgency = bool;
  };
  const setCompletion = (bool) => {
    if (typeof bool != "boolean") return;
    completed = bool;
  };

  const store = () => {
    const storedTasksArray = retrieveTasks();

    const newTasksArray = storedTasksArray.filter((t) => t.id !== id);
    newTasksArray.push(viewDetails());
    localStorage.setItem("tasks", JSON.stringify(newTasksArray));
  };

  return {
    getId,
    getName,
    getDescription,
    getDueDate,
    getUrgency,
    getCompleted,
    viewDetails,
    setId,
    setName,
    setDescription,
    setDueDate,
    setUrgency,
    setCompletion,
    store,
  };
};

const recreateTaskFromJSON = ({
  id,
  name,
  description,
  dueDate,
  urgency,
  completed,
}) => {
  const task = createTask(name, true);
  task.setId(id);
  task.setDescription(description);
  task.setDueDate(dueDate);
  task.setUrgency(urgency);
  task.setCompletion(completed);

  return task;
};

export { createTask, recreateTaskFromJSON };
