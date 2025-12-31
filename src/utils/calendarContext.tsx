import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Selection } from "components/Select";
import { addMinutes, format, subMinutes } from "date-fns";
import { ReactNode, createContext, useState } from "react";
import { Task, Tasks } from "types";

export type CalendarState = {
  displayedDay: Date;
  displayedWeek: Date;
  displayedMonth: Date;
  updateDay: (date: Date) => void;
  updateWeek: (date: Date) => void;
  updateMonth: (date: Date) => void;
  view: Selection;
  setView: (view: Selection) => void;
  taskCount: number;
  setTaskCount: (count: number) => void;
  bucketCount: number;
  setBucketCount: (count: number) => void;
  tasks: Tasks;
  setTasks: (tasks: Tasks) => void;
  createOrUpdateTask: (
    name: string,
    startDateTime: Date,
    endDateTime: Date,
    taskColor: string,
    notes: string
  ) => void;
  updateSelectedTask: (task: Task, shifted15MinIntervals: number) => void;
  createTempTask: (
    id: string,
    startDateTime: Date,
    endDateTime: Date,
    shortPress: boolean
  ) => Task | void;
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
};

const CalendarContext = createContext<CalendarState | null>(null);

interface CalendarContextProps {
  children: ReactNode;
}

export const views: { [key: string]: Selection } = {
  month: {
    label: "Month",
    value: "month",
    icon: <FontAwesome6 name="calendar-days" size={24} color="black" />,
  },
  week: {
    label: "Week",
    value: "week",
    icon: <FontAwesome6 name="calendar-week" size={24} color="black" />,
  },
};

export const updateDateTimes = (task: Task, shifted15MinIntervals: number) => {
  let newStartDateTime = task.startDateTime;
  let newEndDateTime = task.endDateTime;
  const timeDiffInMinutes =
    (task.endDateTime.getTime() - task.startDateTime.getTime()) / 60 / 1000;
  if (shifted15MinIntervals > 0) {
    newStartDateTime = addMinutes(
      task.startDateTime,
      shifted15MinIntervals * 15
    );
  } else {
    newStartDateTime = subMinutes(
      task.startDateTime,
      Math.abs(shifted15MinIntervals) * 15
    );
  }
  newEndDateTime = addMinutes(newStartDateTime, timeDiffInMinutes);
  return { newStartDateTime, newEndDateTime };
};

export function CalendarProvider({ children }: CalendarContextProps) {
  const [currentView, setCurrentView] = useState<Selection>(views.week);
  const [currentDay, setCurrentDay] = useState<Date>(new Date());
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [taskCount, setTaskCount] = useState<number>(0);
  const [bucketCount, setBucketCount] = useState<number>(0);
  const [tasks, setTasks] = useState<Tasks>({});
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const updateSelectedTask = (task: Task, shifted15MinIntervals: number) => {
    if (!selectedTask) {
      return;
    }
    const currentTask = { ...task };
    const { newStartDateTime, newEndDateTime } = updateDateTimes(
      task,
      shifted15MinIntervals
    );
    currentTask.startDateTime = newStartDateTime;
    currentTask.endDateTime = newEndDateTime;
    setSelectedTask(currentTask);
  };

  const createTempTask = (
    id: string,
    startDateTime: Date,
    endDateTime: Date,
    shortPress: boolean
  ) => {
    const currentTaskCount = taskCount ? taskCount + 1 : 1;
    const currentTaskId = "task" + currentTaskCount;
    const currentBucketCount = bucketCount ? bucketCount + 1 : 1;
    const currentBucketId = "bucket" + currentBucketCount;
    const tempTask = {
      id,
      taskId: currentTaskId,
      bucketId: currentBucketId,
      name: "",
      color: "bg-teal-500",
      startDateTime,
      endDateTime,
    };
    setSelectedTask(tempTask);
    setTaskCount(taskCount);
    setBucketCount(currentBucketCount);
    if (shortPress) {
      return tempTask;
    }
  };

  const handleTaskDeletion = async () => {
    const currentTasks = { ...tasks };
    if (selectedTask?.startDateTime) {
      const currentTaskStartDate = format(
        selectedTask.startDateTime,
        "yyyy-MMM-dd"
      );
      currentTasks[currentTaskStartDate][selectedTask.bucketId].splice(
        currentTasks[currentTaskStartDate][selectedTask.bucketId].indexOf(
          selectedTask
        ),
        1
      );
      if (!currentTasks[currentTaskStartDate][selectedTask.bucketId].length) {
        delete currentTasks[currentTaskStartDate][selectedTask.bucketId];
      }
    }
    setTasks({ ...currentTasks });
  };

  const createOrUpdateTask = (
    name: string,
    startDateTime: Date,
    endDateTime: Date,
    taskColor: string,
    notes: string
  ) => {
    const currentTasks = tasks ? { ...tasks } : {};
    console.log(startDateTime, endDateTime);
    console.log("currentTasks", currentTasks);
    const currentTaskStartDateTime: Date = startDateTime;
    const currentTaskEndDateTime: Date = endDateTime;
    const currentTaskStartDate = format(startDateTime, "yyyy-MMM-dd");
    const currentName: string = name;
    const currentNotes: string = notes;

    // Editing a task
    if (selectedTask?.id !== "temp") {
      handleTaskDeletion();
    }

    const currentTaskCount = taskCount ? taskCount + 1 : 1;
    if (typeof setTaskCount === "function") {
      setTaskCount(currentTaskCount);
    }
    const taskId =
      selectedTask && selectedTask.id !== "temp"
        ? selectedTask.id
        : "task" + taskCount;

    if (!currentTasks[currentTaskStartDate]) {
      currentTasks[currentTaskStartDate] = {};
    }

    if (!Object.entries(currentTasks[currentTaskStartDate]).length) {
      const currentBucketCount = Object.entries(
        currentTasks[currentTaskStartDate]
      ).length;
      if (typeof setBucketCount === "function") {
        setBucketCount(currentBucketCount);
      }
      const bucketId = "bucket" + bucketCount;
      currentTasks[currentTaskStartDate][bucketId] = [
        {
          id: taskCount + "_" + taskId + "_" + bucketId,
          taskId,
          // userId: session.user.id,
          bucketId,
          name: currentName,
          color: taskColor,
          // beforeColor: taskBorderColors[taskColor],
          startDateTime: currentTaskStartDateTime,
          endDateTime: currentTaskEndDateTime,
          notes: currentNotes,
        },
      ];
    } else if (Object.entries(currentTasks[currentTaskStartDate])?.length) {
      let overlapped = false;
      // Checks if new task overlaps with current buckets
      Object.entries(currentTasks[currentTaskStartDate]).forEach(
        ([bucketIndex, bucket]) => {
          Object.values(bucket).forEach(async (task) => {
            if (overlapped) {
              return;
            }
            const currentTaskStartDateTimeThreshold = new Date(
              task.startDateTime.getTime() + 30 * 60000
            );
            const currentTaskEndDateTimeThreshold = new Date(
              task.endDateTime.getTime() - 30 * 60000
            );
            if (
              currentTaskStartDateTime >= task.startDateTime &&
              currentTaskStartDateTime < currentTaskStartDateTimeThreshold
            ) {
              currentTasks[currentTaskStartDate][bucketIndex].push({
                id: taskCount + "_" + taskId + "_" + bucketIndex,
                taskId,
                // userId: session.user.id,
                bucketId: bucketIndex,
                name: currentName,
                color: taskColor,
                // beforeColor: taskBorderColors[taskColor],
                startDateTime: currentTaskStartDateTime,
                endDateTime: currentTaskEndDateTime,
                notes: currentNotes,
              });
              overlapped = true;
              return;
            }
            if (
              bucket.length > 1 &&
              currentTaskStartDateTime >= currentTaskEndDateTimeThreshold &&
              currentTaskStartDateTime < task.endDateTime
            ) {
              currentTasks[currentTaskStartDate][bucketIndex].push({
                id: taskCount + "_" + taskId + "_" + bucketIndex,
                taskId,
                // userId: session.user.id,
                bucketId: bucketIndex,
                name: currentName,
                color: taskColor,
                // beforeColor: taskBorderColors[taskColor],
                startDateTime: currentTaskStartDateTime,
                endDateTime: currentTaskEndDateTime,
                notes: currentNotes,
              });
              overlapped = true;
            }
          });
        }
      );
      // Adding to the same date, but not the same bucket
      if (!overlapped) {
        const currentBucketCount = bucketCount
          ? bucketCount + 1
          : Object.entries(currentTasks[currentTaskStartDate]).length + 1;

        if (typeof setBucketCount === "function") {
          setBucketCount(currentBucketCount);
        }
        const bucketId = "bucket" + currentBucketCount;
        currentTasks[currentTaskStartDate][bucketId] = [
          {
            id: taskCount + "_" + taskId + "_" + bucketId,
            taskId,
            // userId: session.user.id,
            bucketId,
            name: currentName,
            color: taskColor,
            // beforeColor: taskBorderColors[taskColor],
            startDateTime: currentTaskStartDateTime,
            endDateTime: currentTaskEndDateTime,
            notes: currentNotes,
          },
        ];
      }
    }
    setTasks({ ...currentTasks });
    setSelectedTask(null);
  };

  const value = {
    displayedDay: currentDay,
    displayedWeek: currentWeek,
    displayedMonth: currentMonth,
    updateDay: setCurrentDay,
    updateWeek: setCurrentWeek,
    updateMonth: setCurrentMonth,
    view: currentView,
    setView: setCurrentView,
    taskCount,
    setTaskCount,
    bucketCount,
    setBucketCount,
    tasks,
    setTasks,
    createOrUpdateTask,
    updateSelectedTask,
    createTempTask,
    selectedTask,
    setSelectedTask,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export default CalendarContext;
