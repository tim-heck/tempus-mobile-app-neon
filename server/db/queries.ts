import { desc, eq } from "drizzle-orm";
import { Task } from "../types";
import { db } from "./db";
import { tasks } from "./schema";

export const getTasksByUserId = async (userId: string) => {
  return await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .orderBy(desc(tasks.startDateTime));
};

export const insertTask = async (task: Task) => {
  if (!task.userId) {
    throw new Error("User ID is required");
  }
  return await db.insert(tasks).values({
    taskId: task.taskId,
    userId: task.userId,
    bucketId: task.bucketId,
    name: task.name,
    color: task.color,
    startDateTime: task.startDateTime,
    endDateTime: task.endDateTime,
    notes: task.notes,
  });
};
