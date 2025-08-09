import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExist } from "../middleware/project";
import { hasAuthorization, taskBelongsToProject, taskExist } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  body("projectName").notEmpty().withMessage("El nombre del Proyecto es obligatorio."),
  body("clientName").notEmpty().withMessage("El nombre del cliente del Proyecto es obligatorio."),
  body("description").notEmpty().withMessage("la descripcion del Proyecto es obligatoria."),
  handleInputErrors,
  ProjectController.createProject
);
router.get("/", ProjectController.getAllProjects);

router.get(
  "/:id",
  param("id").isMongoId().withMessage("Id no valido"),
  handleInputErrors,
  ProjectController.getProjectById
);

// routes for task
router.param("projectid", projectExist); //esto se ejecutara antes de que corra cualquier codigo que tenga este param

router.put(
  "/:projectid",
  param("projectid").isMongoId().withMessage("Id no valido"),
  body("projectName").notEmpty().withMessage("El nombre del Proyecto es obligatorio."),
  body("clientName").notEmpty().withMessage("El nombre del cliente del Proyecto es obligatorio."),
  body("description").notEmpty().withMessage("la descripcion del Proyecto es obligatoria."),
  handleInputErrors,
  hasAuthorization,
  ProjectController.udpateProject
);

router.delete(
  "/:projectid",
  param("projectid").isMongoId().withMessage("Id no valido"),
  handleInputErrors,
  hasAuthorization,
  ProjectController.deleteProject
);

router.post(
  "/:projectid/tasks",
  hasAuthorization,
  // validateProjectExist,
  body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio."),
  body("description").notEmpty().withMessage("la descripcion de la tarea es obligatorio."),
  TaskController.createTask
);

router.get("/:projectid/tasks", TaskController.getProjectTasks);

router.param("taskid", taskExist); //esto se ejecutara antes de que corra cualquier codigo que tenga este param
router.param("taskid", taskBelongsToProject); //esto se ejecutara antes de que corra cualquier codigo que tenga este param

router.get(
  "/:projectid/tasks/:taskid",
  param("taskid").isMongoId().withMessage("Id no valido"),
  TaskController.getTaskById
);

router.put(
  "/:projectid/tasks/:taskid",
  hasAuthorization,
  param("taskid").isMongoId().withMessage("Id no valido"),
  body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio."),
  body("description").notEmpty().withMessage("la descripcion de la tarea es obligatorio."),
  handleInputErrors,
  TaskController.updateTask
);
router.get("/:projectid/tasks", TaskController.getProjectTasks);

router.delete(
  "/:projectid/tasks/:taskid",
  hasAuthorization,
  param("taskid").isMongoId().withMessage("Id no valido"),
  TaskController.deleteTask
);

router.post(
  "/:projectid/tasks/:taskid/status",
  param("taskid").isMongoId().withMessage("Id no valido"),
  TaskController.updateStatusTask
);

// routes for teams
router.post(
  "/:projectid/team/find",
  body("email").isEmail().toLowerCase().withMessage("Email no valido"),
  handleInputErrors,
  TeamMemberController.findMemberByEmail
);

router.get("/:projectid/team", TeamMemberController.getProjectTeam);

router.post(
  "/:projectid/:team",
  body("id").isMongoId().withMessage("ID no valido"),
  handleInputErrors,
  TeamMemberController.addMemberById
);

router.delete("/:projectid/team/:userId", handleInputErrors, TeamMemberController.removeMemberById);

// routes for notes
router.post(
  "/:projectid/tasks/:taskid/notes",
  body("content").notEmpty().withMessage("El contenido de la nota es obligatorio"),
  handleInputErrors,
  NoteController.createNote
);

router.get("/:projectid/tasks/:taskid/notes", NoteController.getTaskNotes);

router.delete(
  "/:projectid/tasks/:taskid/notes/:noteId",
  param("noteId").isMongoId().withMessage("id no valido"),
  handleInputErrors,
  NoteController.deleteNote
);
export default router;
