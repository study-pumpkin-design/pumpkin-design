import type { Request, Response } from "express";
class CourseController {
  async createCourse(req: Request, res: Response) {
    try {
    } catch (error: any) {
      let message = "Internal Server Error";

      return res.status(500).json({
        data: null,
        statusCode: 500,
        message,
      });
    }
  }
  async updateCourse(req: Request, res: Response) {
    try {
    } catch (error: any) {
      let message = "Internal Server Error";

      return res.status(500).json({
        data: null,
        statusCode: 500,
        message,
      });
    }
  }
  async deleteCourse(req: Request, res: Response) {
    try {
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
    } catch (error: any) {
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
    } catch (error: any) {
      let message = "Internal Server Error";

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
