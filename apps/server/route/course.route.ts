import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import isAdmin from "../middleware/admin.middleware";
import courseController from "../controller/course.controller";
import moduleController from "../controller/module.controller";
import moduleContentController from "../controller/module-content.controller";

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

courseRouter.post(
  "/:courseId/modules",
  authMiddleware,
  isAdmin,
  moduleController.create.bind(moduleController),
);
courseRouter.patch(
  "/modules/:id",
  authMiddleware,
  isAdmin,
  moduleController.update.bind(moduleController),
);
courseRouter.delete(
  "/modules/:id",
  authMiddleware,
  isAdmin,
  moduleController.delete.bind(moduleController),
);

courseRouter.post(
  "/modules/:moduleId/contents",
  authMiddleware,
  isAdmin,
  moduleContentController.create.bind(moduleContentController),
);
courseRouter.patch(
  "/contents/:id",
  authMiddleware,
  isAdmin,
  moduleContentController.update.bind(moduleContentController),
);
courseRouter.delete(
  "/contents/:id",
  authMiddleware,
  isAdmin,
  moduleContentController.delete.bind(moduleContentController),
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
