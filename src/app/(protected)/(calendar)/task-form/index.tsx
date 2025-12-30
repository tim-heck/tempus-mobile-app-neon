import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useContext, useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
// import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Button } from "components/Button";
import ColorPicker from "components/ColorPicker";
import { ColorMenuItem } from "types";
import CalendarContext from "utils/calendarContext";
import { taskBaseColors } from "utils/constants";
import TempTaskContext from "utils/tempTaskContext";

export default function TaskFormModal() {
  const calendarState = useContext(CalendarContext);
  const tempTaskState = useContext(TempTaskContext);
  // const defaultStyles = useDefaultStyles();

  const [showStartDatePicker, setShowStartDatePicker] =
    useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);

  const [name, setName] = useState<string>(
    calendarState?.selectedTask ? calendarState.selectedTask.name : ""
  );
  const [startDateTime, setStartDateTime] = useState<Date>(
    calendarState?.selectedTask
      ? calendarState?.selectedTask.startDateTime
      : new Date()
  );
  const [endDateTime, setEndDateTime] = useState<Date>(
    calendarState?.selectedTask
      ? calendarState?.selectedTask.endDateTime
      : new Date()
  );
  const [color, setColor] = useState<ColorMenuItem>(
    calendarState?.selectedTask
      ? taskBaseColors[calendarState?.selectedTask.color]
      : taskBaseColors["bg-teal-500"]
  );
  const [notes, setNotes] = useState<string>(
    calendarState?.selectedTask?.notes ? calendarState.selectedTask.notes : ""
  );

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (
      calendarState?.selectedTask &&
      typeof tempTaskState?.setTempStartDateTime === "function" &&
      typeof tempTaskState?.setTempEndDateTime === "function" &&
      typeof tempTaskState?.setTempTaskColor === "function"
    ) {
      tempTaskState?.setTempStartDateTime(
        calendarState?.selectedTask.startDateTime
      );
      tempTaskState?.setTempEndDateTime(
        calendarState?.selectedTask.endDateTime
      );
      setColor(taskBaseColors[calendarState?.selectedTask.color]);
      tempTaskState?.setTempTaskColor(
        taskBaseColors[calendarState?.selectedTask.color]
      );
    }
  }, []);

  // useEffect(() => {
  //   console.log(params);
  //   console.log(calendarState);
  //   if (
  //     calendarState?.selectedTask &&
  //     typeof tempTaskState?.setTempStartDateTime === "function" &&
  //     typeof tempTaskState?.setTempEndDateTime === "function" &&
  //     typeof tempTaskState?.setTempTaskColor === "function"
  //   ) {
  //     tempTaskState?.setTempStartDateTime(
  //       calendarState?.selectedTask.startDateTime
  //     );
  //     tempTaskState?.setTempEndDateTime(
  //       calendarState?.selectedTask.endDateTime
  //     );
  //     tempTaskState?.setTempTaskColor(
  //       taskBaseColors[calendarState?.selectedTask.color]
  //     );
  //   }
  //   if (
  //     params.newStartDateTime &&
  //     params.newEndDateTime &&
  //     typeof tempTaskState?.setTempStartDateTime === "function" &&
  //     typeof tempTaskState?.setTempEndDateTime === "function"
  //   ) {
  //     const newStartDate = params.newStartDateTime
  //       ? new Date(params.newStartDateTime as string)
  //       : null;
  //     const newEndDate = params.newEndDateTime
  //       ? new Date(params.newEndDateTime as string)
  //       : null;
  //     if (newStartDate && !isNaN(newStartDate.getTime())) {
  //       tempTaskState?.setTempStartDateTime(newStartDate);
  //     }
  //     if (newEndDate && !isNaN(newEndDate.getTime())) {
  //       tempTaskState?.setTempEndDateTime(newEndDate);
  //     }
  //   }
  //   if (params.task) {
  //     const task =
  //       typeof params.task === "string" ? JSON.parse(params.task) : params.task;
  //     if (task && typeof task === "object") {
  //       tempTaskState?.setTempName(task.name || "");
  //       const startDate =
  //         typeof task.startDateTime === "string"
  //           ? new Date(task.startDateTime)
  //           : task.startDateTime;
  //       const endDate =
  //         typeof task.endDateTime === "string"
  //           ? new Date(task.endDateTime)
  //           : task.endDateTime;
  //       if (startDate && !isNaN(startDate.getTime())) {
  //         tempTaskState?.setTempStartDateTime(startDate);
  //       }
  //       if (endDate && !isNaN(endDate.getTime())) {
  //         tempTaskState?.setTempEndDateTime(endDate);
  //       }
  //       if (task.color) {
  //         tempTaskState?.setTempTaskColor(taskBaseColors[task.color]);
  //       }
  //       tempTaskState?.setTempNotes(task.notes || "");
  //     }
  //   }
  // }, [
  //   calendarState,
  //   params.task,
  //   params.newStartDateTime,
  //   params.newEndDateTime,
  //   tempTaskState,
  // ]);

  const updateStartDate = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate;
    setShowStartDatePicker(false);
    setStartDateTime(currentDate as Date);
    tempTaskState?.setTempStartDateTime(currentDate as Date);
  };

  const updateEndDate = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate;
    setShowEndDatePicker(false);
    setEndDateTime(currentDate as Date);
    tempTaskState?.setTempEndDateTime(currentDate as Date);
  };

  return (
    <View className="relative h-full bg-white">
      <ScrollView contentContainerStyle={styles.taskForm}>
        <View className="flex flex-col">
          <View className="flex flex-row p-4">
            <TextInput
              onChangeText={(newText) => setName(newText)}
              defaultValue={name}
              placeholder="Task Name"
              className="flex w-full flex-1 items-center rounded-md bg-neutral-200 p-4 text-lg font-semibold leading-tight"
            />
          </View>
          <View className="h-[1px] w-full bg-neutral-200" />
          <View className="flex flex-col gap-2 p-4">
            <View className="flex flex-row items-center justify-between">
              <Text className="text-lg font-semibold">Start:</Text>
              <View className="flex flex-row">
                {/* <TouchableOpacity
                  className="rounded-md bg-neutral-200 p-2 px-4"
                  onPress={() => {
                    if (showEndDatePicker) {
                      setShowEndDatePicker(!showEndDatePicker);
                    }
                    setShowStartDatePicker(!showStartDatePicker);
                  }}
                >
                  <Text className="text-lg font-semibold">
                    {format(
                      tempTaskState?.tempStartDateTime
                        ? tempTaskState.tempStartDateTime.toString()
                        : "",
                      "MMM d, yyyy p"
                    )}
                  </Text>
                </TouchableOpacity> */}
                <DateTimePicker
                  testID="startDateTimeDate"
                  value={startDateTime as Date}
                  mode={"date"}
                  is24Hour={false}
                  onChange={updateStartDate}
                />
                <DateTimePicker
                  testID="startDateTimeTime"
                  value={startDateTime as Date}
                  mode={"time"}
                  is24Hour={false}
                  onChange={updateStartDate}
                />
              </View>
            </View>
            {/* {showStartDatePicker && (
              <DateTimePicker
                mode="single"
                date={tempTaskState?.tempStartDateTime}
                onChange={({ date }) =>
                  tempTaskState?.setTempStartDateTime(date as Date)
                }
                styles={defaultStyles}
                timePicker
                use12Hours
              />
            )} */}
            <View className="flex flex-row items-center justify-between">
              <Text className="text-lg font-semibold">End:</Text>
              <View className="flex flex-row">
                {/* <TouchableOpacity
                  className="rounded-md bg-neutral-200 p-2 px-4"
                  onPress={() => {
                    if (showStartDatePicker) {
                      setShowStartDatePicker(!showStartDatePicker);
                    }
                    setShowEndDatePicker(!showEndDatePicker);
                  }}
                >
                  <Text className="text-lg font-semibold">
                    {format(
                      tempTaskState?.tempEndDateTime
                        ? tempTaskState.tempEndDateTime.toString()
                        : "",
                      "MMM d, yyyy p"
                    )}
                  </Text>
                </TouchableOpacity> */}
                <DateTimePicker
                  testID="endDateTimeDate"
                  value={endDateTime as Date}
                  mode={"date"}
                  is24Hour={false}
                  onChange={updateEndDate}
                />
                <DateTimePicker
                  testID="endDateTimeTime"
                  value={endDateTime as Date}
                  mode={"time"}
                  is24Hour={false}
                  onChange={updateEndDate}
                />
              </View>
            </View>
            {/* {showEndDatePicker && (
              <DateTimePicker
                mode="single"
                date={tempTaskState?.tempEndDateTime}
                onChange={({ date }) => {
                  tempTaskState?.setTempEndDateTime(date as Date);
                }}
                styles={defaultStyles}
                timePicker
                use12Hours
              />
            )} */}
            {/* {showEndDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={tempTaskState?.tempEndDateTime as Date}
                mode={endTimeMode}
                is24Hour={false}
                onChange={updateEndDate}
              />
            )} */}
          </View>
          <View className="h-[1px] w-full bg-neutral-200" />
          <TouchableWithoutFeedback
            // onPress={() => router.push("/task-form/color-picker")}
            onPress={() => setModalOpen(true)}
          >
            <View className="relative w-full flex-row items-center justify-between gap-2 p-4">
              <Text className="text-lg font-semibold text-black">
                Task color:
              </Text>
              <View
                className={`w-1/2 rounded-md px-2 py-2 ${color.value} flex-row justify-between`}
              >
                <Text className="text-lg font-semibold text-white">
                  {color.label}
                </Text>
                <FontAwesome5 name="caret-down" size={20} color="white" />
              </View>
            </View>
          </TouchableWithoutFeedback>
          <View className="h-[1px] w-full bg-neutral-200" />
          <View className="flex flex-row p-4">
            <TextInput
              editable
              multiline
              numberOfLines={4}
              onChangeText={(newText) => setNotes(newText)}
              defaultValue={notes}
              placeholder="Notes..."
              className="h-[100px] w-full flex-1 rounded-md bg-neutral-200 p-4 text-lg font-semibold leading-tight"
            />
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={modalOpen}
        animationType="slide"
        // transparent
        presentationStyle="pageSheet"
      >
        <View className="flex flex-col flex-1 items-center justify-center">
          <View className="rounded-lg bg-white flex-1">
            <ColorPicker
              selectedColor={color}
              setColor={setColor}
              setIsOpen={setModalOpen}
            />
            <Button
              title="Close"
              theme="secondary"
              onPress={() => {
                setModalOpen(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  taskForm: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
    flex: 1,
  },
  background: {},
});
