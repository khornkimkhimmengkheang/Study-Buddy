import { useState, useEffect, useCallback } from "react";
import { Course } from "@/types";
import { coursesApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const COURSE_COLORS = [
  "#6366f1", // Indigo
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#ec4899", // Pink
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#84cc16", // Lime
];

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await coursesApi.getAll();
      setCourses(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const createCourse = async (name: string, color?: string) => {
    try {
      const courseColor =
        color || COURSE_COLORS[courses.length % COURSE_COLORS.length];
      const newCourse = await coursesApi.create({ name, color: courseColor });
      setCourses((prev) => [...prev, newCourse]);
      toast({
        title: "Course created",
        description: `${name} has been added.`,
      });
      return newCourse;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create course",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCourse = async (id: string, updates: Partial<Course>) => {
    try {
      const updated = await coursesApi.update(id, updates);
      setCourses((prev) => prev.map((c) => (c.id === id ? updated : c)));
      toast({
        title: "Course updated",
        description: "Changes saved successfully.",
      });
      return updated;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update course",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      const course = courses.find((c) => c.id === id);
      await coursesApi.delete(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      toast({
        title: "Course deleted",
        description: `${course?.name} has been removed.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getCourseById = (id: string) => courses.find((c) => c.id === id);

  return {
    courses,
    isLoading,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseById,
    refetch: fetchCourses,
    courseColors: COURSE_COLORS,
  };
}
