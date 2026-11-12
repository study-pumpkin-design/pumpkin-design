import type { Request, Response } from "express";
import type { courseTypes } from "@sd/types";
import moduleService from "../service/module.service";

class ModuleController {
  async create(req: Request, res: Response) {
    try {
      const courseId = req.params.courseId as string;
      const name =
        typeof req.body.name === "string" ? req.body.name.trim() : "";
      if (!courseId || !name) throw new Error("INCORRECT_INPUT_DATA");

      const module = await moduleService.create({ courseId, name });
      return res
        .status(201)
        .json({
          data: module,
          message: "Module created successfully",
          statusCode: 201,
        });
    } catch (error: any) {
      return this.respondWithError(res, error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const name =
        typeof req.body.name === "string" ? req.body.name.trim() : "";
      if (!id || !name) throw new Error("INCORRECT_INPUT_DATA");

      const module = await moduleService.update(id, {
        name,
      } satisfies courseTypes.UpdateModuleDTO);
      return res
        .status(200)
        .json({
          data: module,
          message: "Module updated successfully",
          statusCode: 200,
        });
    } catch (error: any) {
      return this.respondWithError(res, error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      if (!id) throw new Error("INVALID_MODULE_ID");
      const module = await moduleService.delete(id);
      return res
        .status(200)
        .json({
          data: module,
          message: "Module deleted successfully",
          statusCode: 200,
        });
    } catch (error: any) {
      return this.respondWithError(res, error);
    }
  }

  private respondWithError(res: Response, error: Error) {
    const knownError = [
      "INCORRECT_INPUT_DATA",
      "INVALID_MODULE_ID",
      "INVALID_COURSE_ID",
    ].includes(error.message);
    return res
      .status(knownError ? 400 : 500)
      .json({
        data: null,
        message: knownError
          ? "Please check the course and module details."
          : "Internal Server Error",
        statusCode: knownError ? 400 : 500,
      });
  }
}

const moduleController = new ModuleController();
export default moduleController;
