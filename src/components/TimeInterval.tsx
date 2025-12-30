import { addHours, setHours, setMinutes } from "date-fns";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Text, TouchableWithoutFeedback, View } from "react-native";
import { QuarterHourInterval, Task } from "types";
import CalendarContext from "utils/calendarContext";

interface TimeIntervalProps {
  currentDay: Date | null;
  currentInterval: QuarterHourInterval;
  isHour: boolean;
}

export default function TimeInterval({
  currentDay,
  currentInterval,
  isHour,
}: TimeIntervalProps) {
  const calendarContext = useContext(CalendarContext);
  const router = useRouter();

  if (!currentDay) {
    return null;
  }

  return (
    <>
      <View
        className={`${calendarContext?.selectedTask ? "pointer-events-none" : ""}`}
      >
        <View className="flex flex-row items-center gap-1">
          <View className="h-[15px] flex-[0.1_1_0] pr-1">
            {isHour && (
              <View className="-mt-[9px] flex flex-row items-end justify-end gap-0.5 font-medium text-black">
                <Text className="-mb-[1px] text-[14px]">
                  {currentInterval.displayedHour}
                </Text>
                <Text className="self-end text-[10px]">
                  {currentInterval.timeOfDay}
                </Text>
              </View>
            )}
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              if (typeof calendarContext?.createTempTask === "function") {
                let currentDateTime: Date =
                  calendarContext?.displayedDay || new Date();
                currentDateTime = setHours(
                  currentDateTime,
                  Number(currentInterval.hour)
                );
                currentDateTime = setMinutes(
                  currentDateTime,
                  Number(currentInterval.minute)
                );
                const tempTask: Task | void = calendarContext?.createTempTask(
                  "temp",
                  currentDateTime,
                  new Date(addHours(currentDateTime, 1)),
                  true
                );
                if (tempTask) {
                  calendarContext?.setSelectedTask(tempTask);
                  router.push("/task-form");
                }
              }
            }}
          >
            <View
              className={`z-10 h-[15px] flex-[0.9_1_0] ${isHour ? "border-t-[1px] border-neutral-500" : ""}`}
            />
          </TouchableWithoutFeedback>
        </View>
        {currentInterval.militaryTime === "23:45" && (
          <View className="flex flex-row items-center gap-1">
            <View className="h-[15px] w-[40px] pr-1">
              <View className="-mt-[9px] flex flex-row items-end justify-end gap-0.5 font-medium text-black">
                <Text className="-mb-[1px] text-[14px]">12</Text>
                <Text className="self-end text-[10px]">AM</Text>
              </View>
            </View>
            <View
              className={`z-10 h-[15px] w-full border-t-[1px] border-neutral-500`}
            />
          </View>
        )}
      </View>
    </>
  );
}
