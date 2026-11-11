import { db } from "@sd/db";
import type { courseTypes } from "@sd/types";

class CourseRepository {
  async create(data: courseTypes.CreateCourseDTO) {
    return await db.course.create({
      data,
      select: {
        id: true,
        name: true,
        description: true,
        course_topics: true,
        learning_outcomes: true,
        publish_status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  async update(courseId: string, data: Partial<courseTypes.Course>) {
    const { modules: _modules, ...courseData } = data;

    return await db.course.update({
      where: {
        id: courseId,
      },
      data: courseData,
    });
  }
  async getCourse(condition: any) {
    const dbCourse = await db.course.findUnique({
      where: condition,
    });

    if (dbCourse == null) throw new Error("INVALID_COURSE_ID");

    return dbCourse;
  }
  async deleteCourse(courseId: string) {
    return await db.course.delete({
      where: {
        id: courseId,
      },
    });
  }

  async getAllCourse(condition: any) {
    return await db.course.findMany({
      where: condition,
    });
  }
}
const courseRepository = new CourseRepository();
export default courseRepository;
