import { createProject, recreateProjectFromJSON } from "../../models/Project";
import { createTask, recreateTaskFromJSON } from "../../models/Task";
import {
  retrieveProjectById,
  retrieveProjects,
  retrieveTaskById,
} from "../../helpers/localStorageHelpers";

const createAppController = () => {
  /* METHODS FOR TASKS */
  const getTask = (taskId) => recreateTaskFromJSON(retrieveTaskById(taskId));

  const addTask = ({ name, description, dueDate, urgency, projectId }) => {
    if (!name) return;
    const newTask = createTask(name);
    newTask.setDescription(description);
    newTask.setDueDate(dueDate);
    newTask.setUrgency(urgency);
    newTask.setProjectId(projectId);
    newTask.store();

    const project = newTask.getProjectObject();
    project.addTask(newTask.getId());
    project.store();
  };

  const updateTask = ({
    id,
    name,
    description,
    dueDate,
    urgency,
    completed,
    projectId,
  }) => {
    const task = getTask(id);
    const projectHasChanged = projectId !== task.getProjectId();

    if (projectHasChanged) {
      const currentProject = task.getProjectObject();
      const updatedProject = getProject(projectId);

      currentProject.removeTask(id);
      currentProject.store();
      updatedProject.addTask(id);
      updatedProject.store();
    }

    task.setName(name);
    task.setDescription(description);
    task.setDueDate(dueDate);
    task.setUrgency(urgency);
    task.setCompletion(completed);
    task.setProjectId(projectId);

    task.store();
  };

  const updateTaskCompletion = (taskObject, completionStatus) => {
    taskObject.setCompletion(completionStatus);
    taskObject.store();
  };

  const deleteTask = (taskObject) => {
    const taskId = taskObject.getId();
    const project = taskObject.getProjectObject();

    project.removeTask(taskId);
    project.store();
    taskObject.remove();
  };

  /* METHODS FOR PROJECTS */
  const getProject = (projectId) =>
    recreateProjectFromJSON(retrieveProjectById(projectId));

  const getProjects = (excludeInbox = true) => {
    const storedProjectsInJSONFormat = retrieveProjects();
    let projects = storedProjectsInJSONFormat
      .map((p) => recreateProjectFromJSON(p))
      .sort(
        (a, b) =>
          Number(a.getId().substring(1)) - Number(b.getId().substring(1)),
      );

    projects = excludeInbox
      ? projects.filter((project) => project.getName() !== "Inbox")
      : [
          ...projects.filter((p) => p.getId() === "inbox"),
          ...projects.filter((p) => p.getId() !== "inbox"),
        ];

    return projects;
  };

  const addProject = (newProjectName) => {
    if (!newProjectName) return;
    const newProject = createProject();
    newProject.setName(newProjectName);
    newProject.store();

    return newProject.getId();
  };

  const renameProject = (projectObject, newProjectName) => {
    projectObject.setName(newProjectName);
    projectObject.store();
  };

  const deleteProject = (projectObject) => {
    const taskIdsArray = projectObject.getTaskIds();
    const taskObjectsArray = projectObject.getTasksAsObjects();
    const inbox = getProject("inbox");
    const inboxTaskIds = inbox.getTaskIds();

    taskObjectsArray.forEach((taskObject) => {
      taskObject.setProjectId("inbox");
      taskObject.store();
    });
    inboxTaskIds.push(...taskIdsArray);
    // confirm that every task id in current project object for deletion has moved
    if (!taskIdsArray.every((id) => inboxTaskIds.includes(id))) return;

    inbox.replaceTasks(inboxTaskIds);
    inbox.store();

    projectObject.remove();
  };

  // run
  // Project factory will handle creation of Inbox
  if (retrieveProjects().length === 0) createProject().store();

  return {
    getTask,
    addTask,
    updateTask,
    updateTaskCompletion,
    deleteTask,
    getProject,
    getProjects,
    addProject,
    renameProject,
    deleteProject,
  };
};

export { createAppController };
