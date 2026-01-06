import { FontAwesome5 } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { Stack, router, useNavigation } from "expo-router";
import { authClient } from "lib/auth-client";
import { useContext, useRef } from "react";
import { Text, TouchableWithoutFeedback, View } from "react-native";
import CalendarContext from "utils/calendarContext";
import TempTaskContext from "utils/tempTaskContext";

export default function Layout() {
  const calendarState = useContext(CalendarContext);
  const tempTaskState = useContext(TempTaskContext);
  const nav = useNavigation<DrawerNavigationProp<{}>>();

  const userMenuRef = useRef(null);
  const { data: session } = authClient.useSession();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={() => ({
          headerLeft: () => (
            <Text className="pb-2 pl-4 text-lg font-semibold">
              {format(calendarState?.displayedMonth || new Date(), "yyyy")}
            </Text>
          ),
          // title: 'Tempus',
          title:
            calendarState?.view.value === "month"
              ? format(calendarState?.displayedMonth || new Date(), "MMMM")
              : format(
                  startOfWeek(calendarState?.displayedWeek || new Date()),
                  "MMM d"
                ) +
                "-" +
                format(
                  endOfWeek(calendarState?.displayedWeek || new Date()),
                  "MMM d"
                ),
          headerTitleStyle: {
            fontFamily: "Montserrat",
            fontWeight: 700,
            fontSize: 24,
            paddingBottom: 8,
          },
          headerRight: () => {
            return (
              <View className="relative flex-row items-center gap-2 pb-2 pr-4">
                <TouchableWithoutFeedback
                  ref={userMenuRef}
                  onPress={() => nav.openDrawer()}
                >
                  <View className="mb-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black">
                    <FontAwesome5 name="user-alt" size={18} color="white" />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            );
          },
        })}
      />
      <Stack.Screen
        name="day-selected"
        options={() => ({
          headerLeft: () => (
            <TouchableWithoutFeedback
              onPress={() => {
                router.back();
              }}
            >
              <View className="flex flex-row items-center gap-3 pb-2 pl-4 ">
                <FontAwesome5 name="caret-left" size={24} color="black" />
                <Text className="text-xl font-semibold">
                  {calendarState?.view.value === "month"
                    ? format(
                        calendarState?.displayedMonth || new Date(),
                        "MMMM"
                      )
                    : "Week"}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          ),
          title: "",
          headerRight: () => {
            return (
              <TouchableWithoutFeedback
                className="flex items-center justify-center"
                onPress={() => {
                  tempTaskState?.clearTempTask();
                  router.push("/task-form");
                }}
              >
                <FontAwesome5
                  name="plus"
                  size={24}
                  color="black"
                  className="pb-2 pr-4"
                />
              </TouchableWithoutFeedback>
            );
          },
        })}
      />
      <Stack.Screen
        name="task-form"
        options={() => ({
          presentation: "modal",
          headerLeft: () => {
            return (
              <TouchableWithoutFeedback
                onPress={() => {
                  if (router.canGoBack()) {
                    router.back();
                    calendarState?.setSelectedTask(null);
                  }
                }}
              >
                <View className="flex flex-row items-center gap-3 pl-4">
                  <FontAwesome5 name="caret-left" size={24} color="black" />
                  <Text className="text-xl font-semibold">
                    {format(
                      calendarState?.displayedDay || new Date(),
                      "MMM do"
                    )}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            );
          },
          title: tempTaskState?.tempName || "New Task",
          headerRight: () => {
            return (
              <TouchableWithoutFeedback
                onPress={() => {
                  if (typeof calendarState?.createOrUpdateTask === "function") {
                    calendarState?.createOrUpdateTask(
                      tempTaskState?.tempName || "New Task",
                      tempTaskState?.tempStartDateTime || new Date(),
                      tempTaskState?.tempEndDateTime || new Date(),
                      tempTaskState?.tempTaskColor?.value || "bg-teal-500",
                      tempTaskState?.tempNotes || ""
                    );
                    if (router.canGoBack()) {
                      calendarState?.setSelectedTask(null);
                      router.back();
                    }
                  }
                }}
              >
                <Text className="pr-4 text-xl font-semibold">
                  {tempTaskState?.isEditing ? "Update" : "Add"}
                </Text>
              </TouchableWithoutFeedback>
            );
          },
        })}
      />
    </Stack>
  );
}
