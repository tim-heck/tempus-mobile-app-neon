import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import CalendarContext from "utils/calendarContext";

import { Link } from "expo-router";
import { Task } from "types";
import { taskOpaqueColors } from "utils/constants";

interface TaskProps {
  task: Task;
}

const borderOffset: number = 1;
const positionOffIntervalOffset: number = 1;
const topOffset: number = 14;

export default function TempTask({ task }: TaskProps) {
  const calendarContext = useContext(CalendarContext);
  const [taskPosition, setTaskPosition] = useState<number>(
    Number(format(task.startDateTime, "HH")) * 60 +
      Number(format(task.startDateTime, "mm")) +
      topOffset +
      positionOffIntervalOffset +
      borderOffset
  );
  const timeDiffInMinutes =
    (task.endDateTime.getTime() - task.startDateTime.getTime()) / 60 / 1000;
  const timeForTask =
    timeDiffInMinutes - positionOffIntervalOffset - 2 * borderOffset;
  const taskStyles = {
    height: timeForTask,
  };

  useEffect(() => {
    setTaskPosition(
      Number(format(task.startDateTime, "HH")) * 60 +
        Number(format(task.startDateTime, "mm")) +
        topOffset +
        positionOffIntervalOffset +
        borderOffset
    );
  }, [calendarContext]);

  return (
    <View
      className="absolute z-50 w-full flex-row items-center gap-1"
      style={{ top: taskPosition }}
    >
      <View className="w-[3.5rem]" />
      <View className="relative w-full" style={taskStyles}>
        <Link href="/task-form" push asChild>
          <Pressable
            onPress={() => {
              calendarContext?.setSelectedTask(task);
            }}
          >
            <View className="absolute bottom-0 left-0 right-0 top-0 w-full flex-row">
              <View
                className={`w-[5px] rounded-s ${task.color || "bg-teal-500"}`}
              />
              <View
                className={`justify-left w-full flex-row rounded-e ${taskOpaqueColors[task.color || "bg-teal-500"]}`}
              >
                <Text>{format(task.startDateTime, "h:mm aa")}</Text>
                <Text>-</Text>
                <Text>{format(task.endDateTime, "h:mm aa")}</Text>
              </View>
            </View>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
