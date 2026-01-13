import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Bucket from "components/Bucket";
import { CustomButton } from "components/CustomButton";
import TempTask from "components/TempTask";
import TimeInterval from "components/TimeInterval";
import { addDays, endOfDay, format, startOfDay, subDays } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { BucketElement, QuarterHourInterval, Task, Tasks } from "types";

import CalendarContext from "utils/calendarContext";

export default function CalendarDay() {
  const calendarState = useContext(CalendarContext);
  const [timeIntervals, setTimeIntervals] = useState<QuarterHourInterval[]>([]);
  const today: string = format(Date(), "yyyy-MMM-dd");

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const buildTimeIntervals = () => {
    // Displayed hours and 15 minute intervals
    const currentIntervals: QuarterHourInterval[] = [];
    for (let i = 0; i < 24; i++) {
      const currentTime = new Date();
      currentTime.setHours(i);
      currentTime.setMinutes(0);
      currentTime.setSeconds(0);
      const displayedHour = format(currentTime, "h");
      const timeOfDay = format(currentTime, "aa");
      for (let j = 0; j < 4; j++) {
        const hour = i < 10 ? "0" + i : i;
        const minute = j === 0 ? "00" : j * 15;
        currentIntervals.push({
          militaryTime: hour + ":" + minute,
          hour,
          minute,
          displayedHour,
          timeOfDay,
        });
      }
    }
    setTimeIntervals(currentIntervals);
  };

  useEffect(() => {
    buildTimeIntervals();
  }, []);

  const goForward = () => {
    calendarState?.updateDay(
      addDays(calendarState.displayedDay || new Date(), 1)
    );
  };

  const goBack = () => {
    calendarState?.updateDay(
      subDays(calendarState.displayedDay || new Date(), 1)
    );
  };

  const createTempTask = (id: string, startDate: Date, endDate: Date) => {
    const currentTasks: Tasks = { ...calendarState?.tasks };
    const selectedDay: string = format(
      calendarState?.displayedDay || new Date(),
      "yyyy-MMM-dd"
    );
    const currentTaskCount = calendarState?.taskCount
      ? calendarState?.taskCount + 1
      : 1;
    const currentTaskId = "task" + currentTaskCount;
    const currentBucketCount = calendarState?.bucketCount
      ? calendarState?.bucketCount + 1
      : 1;
    const currentBucketId = "bucket" + currentBucketCount;
    if (!currentTasks[selectedDay]) {
      currentTasks[selectedDay] = {
        [currentBucketId]: [],
      };
    } else if (!currentTasks[selectedDay][currentBucketId]) {
      currentTasks[selectedDay][currentBucketId] = [];
    }
    const tempTask = {
      id,
      taskId: currentTaskId,
      bucketId: currentBucketId,
      name: "New Task",
      startDateTime: startDate,
      endDateTime: endDate,
      color: "bg-teal-500",
      notes: "",
    };
    currentTasks[selectedDay][currentBucketId].push(tempTask);
    calendarState?.setTasks(currentTasks);
  };

  const render15MinuteIntervals = (
    intervals: QuarterHourInterval[],
    currentDay: Date | null
  ) => {
    return (
      <View className="pl-2 pt-4">
        {intervals.map((timeInterval, index) => {
          const currentHour = timeInterval.militaryTime.substring(
            0,
            timeInterval.militaryTime.indexOf(":")
          );
          const currentMinute = timeInterval.militaryTime.substring(
            timeInterval.militaryTime.indexOf(":") + 1,
            timeInterval.militaryTime.length
          );
          const isHour = index % 4 === 0;
          return (
            <TimeInterval
              key={currentDay + currentHour + currentMinute}
              currentDay={currentDay}
              currentInterval={timeInterval}
              isHour={isHour}
            />
          );
        })}
      </View>
    );
  };

  const renderTasks = (currentDay: Date) => {
    const formattedDate = format(currentDay, "yyyy-MMM-dd");
    const bucketedTasks: BucketElement[] = [];
    if (
      calendarState?.tasks &&
      calendarState?.tasks[formattedDate] &&
      JSON.stringify(calendarState?.tasks[formattedDate]).length
    ) {
      Object.values(calendarState?.tasks[formattedDate]).forEach((bucket) => {
        let earliestTime: Date = endOfDay(currentDay);
        let latestTime: Date = startOfDay(currentDay);
        const taskBucket: Task[] = [];
        bucket.forEach((task) => {
          const currentStartDateime = task.startDateTime;
          const currentEndDatetime = task.endDateTime;
          earliestTime =
            currentStartDateime < earliestTime
              ? currentStartDateime
              : earliestTime;
          latestTime =
            currentEndDatetime > latestTime ? currentEndDatetime : latestTime;
          taskBucket.push(task);
        });
        bucketedTasks.push({
          earliestTime,
          latestTime,
          tasks: taskBucket,
          leftMargin: 0,
          overlapCount: 0,
        });
      });
    }

    // Sort buckets by lowest time
    bucketedTasks.sort((a, b) => {
      return a.earliestTime.getTime() - b.earliestTime.getTime();
    });

    return (
      <Bucket bucketedTasks={bucketedTasks} setIsDragging={setIsDragging} />
    );
  };

  useEffect(() => {
    if (calendarState?.selectedTask) {
      setIsDragging(true);
    } else {
      setIsDragging(false);
    }
  }, [calendarState]);

  return (
    <View className="flex h-full w-full flex-col bg-white">
      <View className="border-b-2 border-b-black">
        <View className="w-full flex-row items-center justify-between gap-4">
          <CustomButton
            type="icon"
            icon={<FontAwesome5 name="caret-left" size={28} color="black" />}
            text="Prev"
            onPress={() => goBack()}
          />
          <Text
            className={`font-body text-lg font-semibold ${format(calendarState?.displayedDay || new Date(), "yyyy-MMM-dd") === today ? "text-teal-500" : ""}`}
          >
            {format(
              calendarState?.displayedDay || new Date(),
              "EEEE, MMM do yyyy"
            )}
          </Text>
          <CustomButton
            type="icon"
            iconRight
            icon={<FontAwesome5 name="caret-right" size={28} color="black" />}
            text="Next"
            onPress={() => goForward()}
          />
        </View>
      </View>
      <ScrollView className="relative h-full" scrollEnabled={!isDragging}>
        {render15MinuteIntervals(
          timeIntervals,
          calendarState?.displayedDay || new Date()
        )}
        {renderTasks(calendarState?.displayedDay || new Date())}
        {calendarState?.selectedTask && (
          <TempTask task={calendarState?.selectedTask} />
        )}
      </ScrollView>
    </View>
  );
}
