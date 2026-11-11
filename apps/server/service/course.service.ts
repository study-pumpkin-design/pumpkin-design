import type { courseTypes } from "@sd/types";
import courseRepository from "../repository/course.repository";

class CourseService {
  async createCourse(data: courseTypes.CreateCourseDTO) {
    return await courseRepository.create(data);
  }
  async updateCourse(courseId: string, data: courseTypes.UpdateCourseDTO) {
    const isValid = await this.doesCourseExist(courseId);
    if (!isValid) throw new Error("INVALID_COURSE_ID");
    return await courseRepository.update(courseId, data);
  }
  async getUserCourse(courseId: string) {
    return await courseRepository.getCourse({
      id: courseId,
      publish_status: "PUBLISHED",
    });
  }
  async getAllUserCourse() {
    return await courseRepository.getAllCourse({ publish_status: "PUBLISHED" });
  }
  async getAdminCourse(courseId: string) {
    return await courseRepository.getCourse({
      id: courseId,
    });
  }
  async getAllAdminCourse() {
    return await courseRepository.getAllCourse({});
  }
  async deleteCourse(courseId: string) {
    const isValid = await this.doesCourseExist(courseId);
    if (!isValid) throw new Error("INVALID_COURSE_ID");

    return await courseRepository.deleteCourse(courseId);
  }

  private async doesCourseExist(courseId: string): Promise<boolean> {
    const dbCourse = await courseRepository.getCourse({ id: courseId });
    return dbCourse !== null;
  }
}
const courseService = new CourseService();
export default courseService;
