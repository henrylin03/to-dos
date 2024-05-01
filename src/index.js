import createTask from "./createTask";

const createProject = (name) => {
  const taskList = [];

  const getName = () => name;
  const getTasks = () => taskList;

  const setName = (newProjectName) => (name = newProjectName);
  const addTask = (taskObject) => taskList.push(taskObject);

  return { getName, getTasks, setName, addTask };
};

const app = (function () {
  // show all tasks from localStorage. if none, show "no tasks yet"

  const projects = [];
  const myProject = createProject("My Tasks");
  projects.push(myProject);

  let input = prompt(
    `What would you like to do? Please enter number: 
    1: add something new, 
    2: modify existing task, 
    3: modify existing project`
  );

  if (input === "1") {
    input = prompt(`What would you like to add?
    1: add task,
    2: add project`);

    if (input === "1") {
      const newTask = createTask({
        title: prompt("Please enter a title for the task"),
        description: prompt("Please enter the description of this task"),
      });
      newTask.setDueDate(
        prompt(
          "Please enter a due date for this task in the format: `dd/mm/yyyy` (eg 1/1/2025 for 2025 New Years Day). This is optional. Press enter to not include a due date."
        )
      );
      newTask.setPriority(
        prompt(
          "Please enter a priority for this task. This is optional. Priority will default to 'Medium'. Press enter to continue."
        )
      );
      newTask.setStatus(
        prompt(
          "Please enter the status of this task - 'To Do', 'Doing' or 'Done'. Status will default to 'To Do' if none is entered. Press enter to continue."
        )
      );

      input = prompt(`Would you like to tag this to a project? (Y / N)`);
      if (input.toLowerCase() === "n") return myProject.addTask(newTask);
      // ask whether user wants to create new project or add to existing one

      // myProject.addTask(newTask);
      // myProject.taskList.forEach((task) => console.log(task.viewDetails()));
    }
  }
})();
