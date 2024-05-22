import { createProject, recreateProjectFromJSON } from "../../models/Project";
import { createTask, recreateTaskFromJSON } from "../../models/Task";
import {
  retrieveProjectById,
  retrieveProjects,
  retrieveTaskById,
} from "../../helpers/localStorageHelpers";

const createAppController = () => {
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

  const addProject = (newProjectName) => {
    if (!newProjectName) return;
    const newProject = createProject();
    newProject.setName(newProjectName);
    newProject.store();
  };

  const getProjects = (excludeInbox = true) => {
    const storedProjectsInJSONFormat = retrieveProjects();
    let projects = storedProjectsInJSONFormat
      .map((p) => recreateProjectFromJSON(p))
      .sort((projectA, projectB) => projectA.getId() - projectB.getId());

    projects = excludeInbox
      ? projects.filter((project) => project.getName() !== "Inbox")
      : [
          ...projects.filter((p) => p.getId() === "inbox"),
          ...projects.filter((p) => p.getId() !== "inbox"),
        ];

    return projects;
  };

  const getProject = (projectId) =>
    recreateProjectFromJSON(retrieveProjectById(projectId));

  const getTask = (taskId) => recreateTaskFromJSON(retrieveTaskById(taskId));

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

  // run
  if (localStorage.length === 0) createProject().store();

  return {
    addTask,
    getTask,
    updateTask,
    addProject,
    getProjects,
    getProject,
  };
};

export { createAppController };
