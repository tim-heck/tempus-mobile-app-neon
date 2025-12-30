import { format, getDay } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode, useContext } from "react";
import { Pressable, Text, View } from "react-native";
import CalendarContext from "utils/calendarContext";

import { Link } from "expo-router";
import { Day, Task } from "types/index";
import { twColorsToHex } from "utils/constants";

interface CalendarMonthProps {
  day: Day;
}

export function CalendarMonthDay({ day }: CalendarMonthProps) {
  const calendarContext = useContext(CalendarContext);
  const currentDay = format(Date(), "yyyy-MMM-dd");

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

    const taskComponents: ReactNode[] = [];

    tasksToRender
      .sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime())
      .forEach((task, index) => {
        if (index < 2) {
          taskComponents.push(
            <View
              key={task.id}
              className={`relative flex h-[15px] w-full flex-row items-center rounded-[3px] ${task.color}`}
            >
              <Text className="teal w-full whitespace-nowrap pl-1 text-xs font-bold text-white">
                {task.name}
              </Text>
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={[
                  twColorsToHex[task.color].transparent,
                  twColorsToHex[task.color].solid,
                ]}
                style={{
                  flex: 1,
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 1,
                  borderRadius: 3,
                }}
                // dither={false}
                locations={[0.7, 1]}
              />
            </View>
          );
        }
      });

    if (tasksToRender.length > 2) {
      taskComponents.push(
        <View key="excess-count">
          <Text className="flex h-[15px] w-full text-center font-bold text-neutral-500">
            +{tasksToRender.length - 2}
          </Text>
        </View>
      );
    }

    return taskComponents;
  };

  return (
    <Link href="/day-selected" push asChild className="w-full">
      <Pressable
        className={`relative flex h-28 w-full flex-1 items-center justify-center 
        ${day.day !== 0 ? "" : "pointer-events-none"}`}
        onPress={() => {
          calendarContext?.updateDay(day.date);
        }}
      >
        {day.day !== 0 ? (
          <View
            className={`h-full w-full flex-1 flex-col justify-center gap-2
            ${getDay(day.date) === 0 || getDay(day.date) === 6 ? "bg-neutral-200/60" : ""} 
            ${format(day.date, "yyyy-MMM-dd") === currentDay ? "bg-white" : ""}`}
          >
            <Text
              className={`font-body z-[1] text-center text-lg font-semibold text-black 
            ${format(day.date, "yyyy-MMM-dd") === currentDay ? "font-bold text-teal-500" : ""}`}
            >
              {day.day}
            </Text>
            <View className="w-full flex-1 flex-col gap-[3px] px-1">
              {renderTasks(formattedDate)}
            </View>
          </View>
        ) : (
          <View
            className={`h-full w-full flex-1
            ${getDay(day.date) === 0 || getDay(day.date) === 6 ? "bg-neutral-200/60" : ""} 
            ${format(day.date, "yyyy-MMM-dd") === currentDay ? "bg-white" : ""}`}
          />
        )}
      </Pressable>
    </Link>
  );
}
