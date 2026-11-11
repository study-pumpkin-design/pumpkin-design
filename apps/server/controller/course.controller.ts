import type { courseTypes } from "@sd/types";
import type { Request, Response } from "express";
import courseService from "../service/course.service";
import { validateInput } from "../util/validator";
import { ERROR_CODES } from "../util/error-code";
import adminService from "../service/admin.service";
class CourseController {
  async createCourse(req: Request, res: Response) {
    try {
      const data: courseTypes.CreateCourseDTO = req.body;
      if (!validateInput(data)) throw new Error("INCORRECT_INPUT_DATA");

      const createdCourse = await courseService.createCourse(data);

      return res.status(200).json({
        data: createdCourse,
        message: "Course Created Successfully",
        statusCode: 200,
      });
    } catch (error: any) {
      let message = "Internal Server Error";

      if (error.message === "INCORRECT_INPUT_DATA")
        message = ERROR_CODES.INCORRECT_INPUT_DATA;

      return res.status(500).json({
        data: null,
        statusCode: 500,
        message,
      });
    }
  }
  async updateCourse(req: Request, res: Response) {
    try {
      const courseId = req.params.id as string;
      const data: courseTypes.UpdateCourseDTO = req.body;
      if (!courseId) throw new Error("INVALID_COURSE_ID");

      if (!validateInput(data)) throw new Error("INCORRECT_INPUT_DATA");
      const updatedCourse = await courseService.updateCourse(courseId, data);

      return res.status(200).json({
        data: updatedCourse,
        message: "Course Updated Successfully",
        statusCode: 200,
      });
    } catch (error: any) {
      let message = "Internal Server Error";

      if (error.message === "INCORRECT_INPUT_DATA")
        message = ERROR_CODES.INCORRECT_INPUT_DATA;

      return res.status(500).json({
        data: null,
        statusCode: 500,
        message,
      });
    }
  }
  async deleteCourse(req: Request, res: Response) {
    try {
      const courseId = req.params.id as string;
      if (!courseId) throw new Error("INVALID_COURSE_ID");

      const deletedCourse = await courseService.deleteCourse(courseId);

      return res.status(200).json({
        data: deletedCourse,
        message: "Course deleted successfully!",
        statusCode: 200,
      });
    } catch (error: any) {
      let message = "Internal Server Error";

      return res.status(500).json({
        data: null,
        statusCode: 500,
        message,
      });
    }
  }
  async getCourseById(req: Request, res: Response) {
    try {
      const courseId = req.params.id as string;
      if (!courseId) throw new Error("INVALID_COURSE_ID");

      const dbCourse = await courseService.getUserCourse(courseId);
      return res.status(200).json({
        status: 200,
        message: "Course detailes fetched",
        data: dbCourse,
      });
    } catch (error: any) {
      console.log(error);
      let message = "Internal Server Error";

      return res.status(500).json({
        data: null,
        statusCode: 500,
        message,
      });
    }
  }
  async getAdminCourseById(req: Request, res: Response) {
    try {
      const courseId = req.params.id as string;
      if (!courseId) throw new Error("INVALID_COURSE_ID");

      const dbCourse = await courseService.getAdminCourse(courseId);
      return res.status(200).json({
        status: 200,
        message: "Course detailes fetched",
        data: dbCourse,
      });
    } catch (error: any) {
      console.log(error);
      let message = "Internal Server Error";

      return res.status(500).json({
        data: null,
        statusCode: 500,
        message,
      });
    }
  }
  async getCourses(req: Request, res: Response) {
    try {
      const dbCourse = await courseService.getAllUserCourse();
      return res.status(200).json({
        status: 200,
        message: "Courses fetched",
        data: dbCourse,
      });
    } catch (error: any) {
      let message = "Internal Server Error";
      console.log(error);
      return res.status(500).json({
        data: null,
        statusCode: 500,
        message,
      });
    }
  }
  async getAdminCourses(req: Request, res: Response) {
    try {
      const dbCourse = await courseService.getAllAdminCourse();

      return res.status(200).json({
        status: 200,
        message: "Courses fetched",
        data: dbCourse,
      });
    } catch (error: any) {
      let message = "Internal Server Error";
      console.log(error);
      return res.status(500).json({
        data: null,
        statusCode: 500,
        message,
      });
    }
  }
}
const courseController = new CourseController();
export default courseController;
