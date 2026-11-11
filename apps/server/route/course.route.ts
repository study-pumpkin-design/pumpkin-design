import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import isAdmin from "../middleware/admin.middleware";
import courseController from "../controller/course.controller";

const courseRouter = Router();

courseRouter.post(
  "/create-course",
  authMiddleware,
  isAdmin,
  courseController.createCourse,
);

courseRouter.post(
  "/update-course/:id",
  authMiddleware,
  isAdmin,
  courseController.updateCourse,
);

courseRouter.delete(
  "/delete-course/:id",
  authMiddleware,
  isAdmin,
  courseController.deleteCourse,
);

courseRouter.get("/preview-course/:id", courseController.getCourseById);
courseRouter.get(
  "/admin/course/:id",
  authMiddleware,
  isAdmin,
  courseController.getAdminCourseById,
);
courseRouter.get("/all", courseController.getCourses);
courseRouter.get("/admin/all", courseController.getAdminCourses);

export default courseRouter;
