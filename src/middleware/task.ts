import { NextFunction, Request, Response } from "express";
import Task, { ITask } from "../models/Task";

declare global {
  namespace Express {
    interface Request {
      task: ITask;
    }
  }
}

export async function taskExist(req: Request, res: Response, next: NextFunction) {
  try {
    const { taskid } = req.params;

    const task = await Task.findById(taskid);

    if (!task) {
      const error = new Error("tarea no encontrado");
      res.status(404).json({ error: error.message });
      return;
    }
    req.task = task;
    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
}

export function taskBelongsToProject(req: Request, res: Response, next: NextFunction) {
  if (req.task.project.toString() !== req.project.id.toString()) {
    const error = new Error("Accion no valida");
    res.status(400).json({ error: error.message });
    return;
  }
  next();
}

export function hasAuthorization(req: Request, res: Response, next: NextFunction) {
  if (req.user.id.toString() !== req.project.manager.toString()) {
    const error = new Error("Accion no valida");
    res.status(400).json({ error: error.message });
    return;
  }
  next();
}
