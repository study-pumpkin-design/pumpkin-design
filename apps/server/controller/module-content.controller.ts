import type { Request, Response } from "express";
import type { courseTypes } from "@sd/types";
import moduleContentService from "../service/module-content.service";

const optionalTextFields = [
  "description",
  "text_content",
  "video_content",
  "attached_media",
  "video_thumbnail",
] as const;

class ModuleContentController {
  async create(req: Request, res: Response) {
    try {
      const module_id = req.params.moduleId as string;
      const data = this.parseCreateData(req.body, module_id);
      const content = await moduleContentService.create(data);
      return res.status(201).json({
        data: content,
        message: "Module content created successfully",
        statusCode: 201,
      });
    } catch (error: any) {
      console.log(error);
      return this.respondWithError(res, error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      if (!id) throw new Error("INVALID_MODULE_CONTENT_ID");
      const data = this.parseUpdateData(req.body);
      if (Object.keys(data).length === 0)
        throw new Error("INCORRECT_INPUT_DATA");
      const content = await moduleContentService.update(id, data);
      return res.status(200).json({
        data: content,
        message: "Module content updated successfully",
        statusCode: 200,
      });
    } catch (error: any) {
      console.log(error);
      return this.respondWithError(res, error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      if (!id) throw new Error("INVALID_MODULE_CONTENT_ID");
      const content = await moduleContentService.delete(id);
      return res.status(200).json({
        data: content,
        message: "Module content deleted successfully",
        statusCode: 200,
      });
    } catch (error: any) {
      console.log(error);
      return this.respondWithError(res, error);
    }
  }

  private parseCreateData(
    body: Record<string, unknown>,
    module_id: string,
  ): courseTypes.CreateModuleContentDTO {
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!module_id || !title) throw new Error("INCORRECT_INPUT_DATA");
    const content_visibility =
      body.content_visibility === "ENROLLED" ? "ENROLLED" : "PREVIEW";
    const data: courseTypes.CreateModuleContentDTO = {
      module_id,
      title,
      content_visibility,
      description: null,
      text_content: null,
      video_content: null,
      attached_media: null,
      video_thumbnail: null,
    };
    for (const field of optionalTextFields) {
      if (typeof body[field] === "string")
        data[field] = body[field].trim() || null;
    }
    return data;
  }

  private parseUpdateData(
    body: Record<string, unknown>,
  ): courseTypes.UpdateModuleContentDTO {
    const data: courseTypes.UpdateModuleContentDTO = {};
    if (typeof body.title === "string" && body.title.trim())
      data.title = body.title.trim();
    if (
      body.content_visibility === "PREVIEW" ||
      body.content_visibility === "ENROLLED"
    )
      data.content_visibility = body.content_visibility;
    for (const field of optionalTextFields) {
      if (typeof body[field] === "string" || body[field] === null)
        data[field] =
          body[field] === null ? null : (body[field] as string).trim() || null;
    }
    return data;
  }

  private respondWithError(res: Response, error: Error) {
    const knownError = [
      "INCORRECT_INPUT_DATA",
      "INVALID_MODULE_ID",
      "INVALID_MODULE_CONTENT_ID",
    ].includes(error.message);
    return res.status(knownError ? 400 : 500).json({
      data: null,
      message: knownError
        ? "Please check the lesson details."
        : "Internal Server Error",
      statusCode: knownError ? 400 : 500,
    });
  }
}

const moduleContentController = new ModuleContentController();
export default moduleContentController;
