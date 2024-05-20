import { generateProjectOptions } from "./taskModalsHandlers";

const modal = document.querySelector(".task-details-modal");
const projectDropdown = document.querySelector("#task-project-in-modal");
const cancelBtn = document.querySelector(".task-details-modal .cancel-btn");

const viewAndEditTaskDetails = (e) => {
  cancelBtn.addEventListener("click", () => modal.close());

  // run
  modal.showModal();
  generateProjectOptions(projectDropdown);
};

export default viewAndEditTaskDetails;

//todo: fix issue when user tries to check the checkbox in preview mode, the task pops open
