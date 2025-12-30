import { ReactNode } from "react";

export type Task = {
  id: string;
  taskId: string;
  userId?: string;
  bucketId: string;
  name: string;
  color: string;
  startDateTime: Date;
  endDateTime: Date;
  notes?: string;
};

export type TaskBucket = {
  [time: string]: Task[];
};

export type Tasks = {
  [date: string]: TaskBucket;
};

export type Day = {
  date: Date;
  dateString: string;
  day: number;
  dayOfWeek: string;
};

export type QuarterHourInterval = {
  militaryTime: string; // hh:mm
  hour: number | string;
  minute: number | string;
  displayedHour: string; // h
  timeOfDay: string; // AM or PM
};

export type BucketElement = {
  earliestTime: Date;
  latestTime: Date;
  leftMargin: number;
  overlapCount: number;
  tasks: Task[];
};

export type OverlappedBucket = {
  earliestTime: Date;
  latestTime: Date;
  buckets: BucketElement[];
  layer?: number;
};

export type ColorMenuItem = {
  label: string;
  value: string;
  opaqueValue: string;
  text: string;
  gradient: string;
  icon?: ReactNode;
};
