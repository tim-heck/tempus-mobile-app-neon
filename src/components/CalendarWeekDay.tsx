import { FontAwesome5 } from "@expo/vector-icons";
import { format, getDay } from "date-fns";
import { useContext } from "react";
import { Pressable, Text, View } from "react-native";
import CalendarContext from "utils/calendarContext";

import { Link } from "expo-router";
import { Day, Task } from "types";
import { taskOpaqueColors } from "utils/constants";

interface CalendarWeekProps {
  day: Day;
}

export function CalendarWeekDay({ day }: CalendarWeekProps) {
  const calendarContext = useContext(CalendarContext);
  const today: string = format(Date(), "yyyy-MMM-dd");
  const formattedDate: string = format(day.date, "yyyy-MMM-dd");

  const renderTasks = (date: string) => {
    const tasksToRender: Task[] = [];
    if (
      calendarContext?.tasks &&
      calendarContext?.tasks[date] &&
      JSON.stringify(calendarContext?.tasks[date]).length
    ) {
      Object.values(calendarContext?.tasks[date]).forEach((bucket) => {
        bucket.forEach((task) => {
          tasksToRender.push(task);
        });
      });
    }

    return tasksToRender
      .sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime())
      .map((task) => (
        <Link href="/task-form" push asChild>
          <Pressable
            key={task.id}
            onPress={() => {
              calendarContext?.setSelectedTask(task);
            }}
          >
            <View className="w-full flex-row">
              <View className={`w-[5px] rounded-s ${task.color}`} />
              <View
                className={`z-[2] ${taskOpaqueColors[task.color]} flex-1 flex-row items-center justify-between gap-1 rounded-e px-2`}
              >
                <View className="h-full py-2">
                  <Text className="font-bold">
                    {format(task.startDateTime, "h:mm aa")}
                  </Text>
                  <Text className="font-bold opacity-50">
                    {format(task.endDateTime, "h:mm aa")}
                  </Text>
                </View>
                <View className="h-full py-2">
                  <Text>{task.name}</Text>
                </View>
              </View>
            </View>
          </Pressable>
        </Link>
      ));
  };

  const renderDayLabel = () => {
    return (
      <View
        className={`flex h-full w-[80px] flex-col items-center justify-start gap-2 px-2 pt-1 ${format(day.date, "yyyy-MMM-dd") === today ? "border-neutral-600" : "border-neutral-600"}`}
      >
        <View className="flex w-full flex-row items-start justify-center gap-2 self-start">
          <Text
            className={`font-body z-[1] text-lg font-semibold uppercase 
              ${format(day.date, "yyyy-MMM-dd") === today ? "font-bold text-teal-500" : "text-black "}`}
          >
            {day.dayOfWeek}
          </Text>
          <Text
            className={`font-body z-[1] self-start text-lg font-semibold
              ${format(day.date, "yyyy-MMM-dd") === today ? "font-bold text-teal-500" : "text-black "}`}
          >
            {day.day}
          </Text>
        </View>
        <Link href="/day-selected" push asChild className="w-full">
          <Pressable
            onPress={() => {
              calendarContext?.updateDay(day.date);
            }}
          >
            <View
              className={`w-full flex-row items-center justify-center rounded-md border-2 bg-white p-2 
              ${format(day.date, "yyyy-MMM-dd") === today ? "border-teal-500" : "border-black "}`}
            >
              <FontAwesome5
                name="calendar-day"
                size={24}
                color={`${format(day.date, "yyyy-MMM-dd") === today ? "#14b8a6" : "black"}`}
              />
            </View>
          </Pressable>
        </Link>
      </View>
    );
  };

  return (
    <Link href="/day-selected" push asChild>
      <Pressable
        onPress={() => {
          if (
            !JSON.stringify(calendarContext?.tasks?.[formattedDate])?.length
          ) {
            calendarContext?.updateDay(day.date);
          }
        }}
      >
        <View className="relative flex w-full flex-col items-center justify-center">
          <View
            className={`flex h-full w-full flex-row border-b-2 border-neutral-600 py-2
            ${getDay(day.date) === 0 || getDay(day.date) === 6 ? "bg-neutral-200/60" : ""} 
            ${format(day.date, "yyyy-MMM-dd") === today ? "!bg-white" : ""}
            ${getDay(day.date) === 0 && "border-t-2"}`}
          >
            {renderDayLabel()}
            <View className="h-full w-[3px] rounded-full bg-neutral-600" />
            <View className="flex w-full flex-1 flex-col gap-2 p-2">
              {renderTasks(formattedDate)}
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
