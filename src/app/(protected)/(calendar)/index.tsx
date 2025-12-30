import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {
  addDays,
  addMonths,
  addWeeks,
  format,
  getDay,
  getDaysInMonth,
  isFirstDayOfMonth,
  isLastDayOfMonth,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { useContext, useEffect, useRef, useState } from "react";
import { Animated, Appearance, FlatList, Text, View } from "react-native";

import { CalendarMonthDay } from "components/CalendarMonthDay";
import CalendarWeek from "components/CalendarWeek";
import { CustomButton } from "components/CustomButton";
import Select from "components/Select";
import { SafeAreaView } from "react-native-safe-area-context";
import { Day } from "types";
import CalendarContext, { views } from "utils/calendarContext";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const NUM_OF_WEEKS: number = 52;
const NUM_OF_MONTHS: number = 12;
const NUM_OF_YEARS: number = 1;

export default function Calendar() {
  const calendarState = useContext(CalendarContext);
  const calendarRef = useRef<FlatList>(null);
  const dayViewAnimation = useRef(new Animated.Value(0)).current;
  const colorScheme = Appearance.getColorScheme();

  const [months, setMonths] = useState<Day[][][]>([]);
  const [weeks, setWeeks] = useState<Day[][]>([]);

  const buildInitialWeekView = (today: Date) => {
    const initialWeeks: Day[][] = [];
    let day = startOfWeek(subWeeks(today, 1));
    for (let i = 0; i < 3; i++) {
      const currentWeek: Day[] = [];
      for (let i = 0; i < 7; i++) {
        currentWeek.push({
          date: day,
          dateString: format(day, "yyyy-MMM-dd"),
          day: Number(format(day, "dd")),
          dayOfWeek: format(day, "EEE"),
        });
        day = addDays(day, 1);
      }
      initialWeeks.push(currentWeek);
    }
    setWeeks(initialWeeks);
  };

  const buildNewWeekView = (today: Date) => {
    let day = startOfWeek(today);
    const currentWeek: Day[] = [];
    for (let i = 0; i < 7; i++) {
      currentWeek.push({
        date: day,
        dateString: format(day, "yyyy-MMM-dd"),
        day: Number(format(day, "dd")),
        dayOfWeek: format(day, "EEE"),
      });
      day = addDays(day, 1);
    }
    return currentWeek;
  };

  const buildInitialMonthView = (today: Date) => {
    let day = startOfMonth(subMonths(today, 1));
    const months: Day[][][] = [];
    for (let i = 0; i < 3; i++) {
      const weeks: Day[][] = [];
      let days: Day[] = [];
      for (let i = 0; i < getDaysInMonth(day); i++) {
        if (isFirstDayOfMonth(day)) {
          for (let i = 0; i < getDay(day); i++) {
            const offsetDay = subDays(day, getDay(day) - i);
            days.push({
              date: offsetDay,
              dateString: format(offsetDay, "yyyy-MMM-dd"),
              day: 0,
              dayOfWeek: format(offsetDay, "EEE"),
            });
          }
        }
        if (isLastDayOfMonth(day)) {
          // Push last day of month in
          days.push({
            date: day,
            dateString: format(day, "yyyy-MMM-dd"),
            day: Number(format(day, "dd")),
            dayOfWeek: format(day, "EEE"),
          });
          // Advance to next month, fill in offsets
          day = addDays(day, 1);
          if (getDay(day) !== 0) {
            for (let i = 0; i < 7 - getDay(day); i++) {
              const offsetDay = addDays(day, i);
              days.push({
                date: offsetDay,
                dateString: format(offsetDay, "yyyy-MMM-dd"),
                day: 0,
                dayOfWeek: format(offsetDay, "EEE"),
              });
            }
          }
          weeks.push(days);
          days = [];
          break;
        }
        days.push({
          date: day,
          dateString: format(day, "yyyy-MMM-dd"),
          day: Number(format(day, "dd")),
          dayOfWeek: format(day, "EEE"),
        });
        if (days.length === 7) {
          weeks.push(days);
          days = [];
        }
        day = addDays(day, 1);
      }
      months.push(weeks);
    }
    setMonths(months);
  };

  const buildNewMonthView = (today: Date) => {
    let day = startOfMonth(today);
    const weeks: Day[][] = [];
    let days: Day[] = [];
    for (let i = 0; i < getDaysInMonth(today); i++) {
      if (isFirstDayOfMonth(day)) {
        for (let i = 0; i < getDay(day); i++) {
          const offsetDay = subDays(day, getDay(day) - i);
          days.push({
            date: offsetDay,
            dateString: format(offsetDay, "yyyy-MMM-dd"),
            day: 0,
            dayOfWeek: format(offsetDay, "EEE"),
          });
        }
      }
      if (isLastDayOfMonth(day)) {
        // Push last day of month in
        days.push({
          date: day,
          dateString: format(day, "yyyy-MMM-dd"),
          day: Number(format(day, "dd")),
          dayOfWeek: format(day, "EEE"),
        });
        // Advance to next month, fill in offsets
        day = addDays(day, 1);
        if (getDay(day) !== 0) {
          for (let i = 0; i < 7 - getDay(day); i++) {
            const offsetDay = addDays(day, i);
            days.push({
              date: offsetDay,
              dateString: format(offsetDay, "yyyy-MMM-dd"),
              day: 0,
              dayOfWeek: format(offsetDay, "EEE"),
            });
          }
        }
        weeks.push(days);
        days = [];
        break;
      }
      days.push({
        date: day,
        dateString: format(day, "yyyy-MMM-dd"),
        day: Number(format(day, "dd")),
        dayOfWeek: format(day, "EEE"),
      });
      if (days.length === 7) {
        weeks.push(days);
        days = [];
      }
      day = addDays(day, 1);
    }
    return weeks;
  };

  useEffect(() => {
    buildInitialWeekView(new Date());
    buildInitialMonthView(new Date());
  }, []);

  const goForward = (currentView: string | undefined) => {
    if (currentView === "month") {
      const currentMonths = [...months];
      const currentMonthViewed = calendarState?.displayedMonth || new Date();
      const newMonth = buildNewMonthView(
        startOfMonth(addMonths(currentMonthViewed, 2))
      );
      currentMonths.push(newMonth);
      currentMonths.shift();
      setMonths(currentMonths);
      calendarState?.updateMonth(addMonths(currentMonthViewed, 1));
    } else if (currentView === "week") {
      const currentWeeks = [...weeks];
      const currentWeekViewed = calendarState?.displayedWeek || new Date();
      const newWeek = buildNewWeekView(
        startOfWeek(addWeeks(currentWeekViewed, 2))
      );
      currentWeeks.push(newWeek);
      currentWeeks.shift();
      setWeeks(currentWeeks);
      calendarState?.updateWeek(addWeeks(currentWeekViewed, 1));
    } else {
      // calendarState?.updateDay(addDays(selectedDay, 1));
    }
  };

  const goBack = (currentView: string | undefined) => {
    if (currentView === "month") {
      const currentMonths = [...months];
      const currentMonthViewed = calendarState?.displayedMonth || new Date();
      const newMonth = buildNewMonthView(
        startOfMonth(subMonths(currentMonthViewed, 2))
      );
      currentMonths.unshift(newMonth);
      currentMonths.pop();
      setMonths(currentMonths);
      calendarState?.updateMonth(subMonths(currentMonthViewed, 1));
    } else if (currentView === "week") {
      const currentWeeks = [...weeks];
      const currentWeekViewed = calendarState?.displayedWeek || new Date();
      const newWeek = buildNewWeekView(
        startOfWeek(subWeeks(currentWeekViewed, 2))
      );
      currentWeeks.unshift(newWeek);
      currentWeeks.pop();
      setWeeks(currentWeeks);
      calendarState?.updateWeek(subWeeks(currentWeekViewed, 1));
    } else {
      // calendarState?.updateDay(subDays(selectedDay, 1));
    }
  };

  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      className="flex flex-1 flex-col bg-white"
    >
      <View
        className={`border-b-2 border-b-black ${calendarState?.view.value === "month" ? "mb-2" : ""}`}
      >
        <View className="w-full flex-row items-center justify-between gap-4">
          <CustomButton
            type="icon"
            onPress={() => goBack(calendarState?.view.value)}
          >
            <View className="flex flex-row items-center gap-2">
              <FontAwesome5 name="caret-left" size={28} color="black" />
              <Text className="text-xl font-semibold">Prev</Text>
            </View>
          </CustomButton>
          <Select
            options={views}
            currentValue={calendarState?.view || views.month}
            onValueChange={calendarState?.setView}
          />
          <CustomButton
            type="icon"
            onPress={() => goForward(calendarState?.view.value)}
          >
            <View className="flex flex-row items-center gap-2">
              <Text className="text-xl font-semibold">Next</Text>
              <FontAwesome5 name="caret-right" size={28} color="black" />
            </View>
          </CustomButton>
        </View>
      </View>
      {calendarState?.view.value === "week" && <CalendarWeek week={weeks[1]} />}
      {calendarState?.view.value === "month" && (
        <>
          <View className="flex w-full flex-row items-center justify-center">
            {daysOfWeek.map((day) => (
              <View
                key={day}
                className={`flex h-10 flex-1 items-center justify-center ${day === "Sun" || day === "Sat" ? "bg-neutral-200/60" : ""}`}
              >
                <Text className="min-w-5 pb-6 text-center text-lg text-black">
                  {day}
                </Text>
              </View>
            ))}
          </View>
          <FlatList
            ref={calendarRef}
            data={months[1]}
            renderItem={({ item, index }) => {
              return (
                <View
                  key={item[0].dateString + "_" + index}
                  className="flex w-full flex-row items-center justify-center"
                >
                  {item.map((day: Day, index: number) => {
                    return (
                      <View
                        key={day.dateString + index}
                        className="flex flex-1 items-center justify-center"
                      >
                        <CalendarMonthDay day={day} />
                      </View>
                    );
                  })}
                </View>
              );
            }}
            keyExtractor={(item) =>
              item.map(
                (day: Day, index: number) => day.dateString + "_" + index
              )
            }
          />
        </>
      )}
    </SafeAreaView>
  );
}
