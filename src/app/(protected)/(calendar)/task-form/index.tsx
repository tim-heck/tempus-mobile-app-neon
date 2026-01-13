import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import ColorPicker from "components/ColorPicker";
import { CustomButton } from "components/CustomButton";
import { addHours, startOfHour } from "date-fns";
import { useContext, useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ColorMenuItem } from "types";
import CalendarContext from "utils/calendarContext";
import { taskBaseColors } from "utils/constants";
import TempTaskContext from "utils/tempTaskContext";

const CURRENT_DATE_TIME = new Date();

export default function TaskFormModal() {
  const calendarState = useContext(CalendarContext);
  const tempTaskState = useContext(TempTaskContext);

  const selectedDate = calendarState?.displayedDay
    ? calendarState?.displayedDay.setHours(CURRENT_DATE_TIME.getHours())
    : new Date();

  const [name, setName] = useState<string>(
    calendarState?.selectedTask ? calendarState.selectedTask.name : ""
  );
  const [startDateTime, setStartDateTime] = useState<Date>(
    calendarState?.selectedTask
      ? calendarState?.selectedTask.startDateTime
      : startOfHour(selectedDate)
  );
  const [endDateTime, setEndDateTime] = useState<Date>(
    calendarState?.selectedTask
      ? calendarState?.selectedTask.endDateTime
      : startOfHour(addHours(selectedDate, 1))
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
      typeof tempTaskState?.setTempTaskColor === "function"
    ) {
      setColor(taskBaseColors[calendarState?.selectedTask.color]);
      tempTaskState?.setTempTaskColor(
        taskBaseColors[calendarState?.selectedTask.color]
      );
    }
  }, []);

  const updateStartDate = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate;
    setStartDateTime(currentDate as Date);
    tempTaskState?.setTempStartDateTime(currentDate as Date);
  };

  const updateEndDate = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate;
    setEndDateTime(currentDate as Date);
    tempTaskState?.setTempEndDateTime(currentDate as Date);
  };

  useEffect(() => {
    tempTaskState?.setTempName(name);
    tempTaskState?.setTempStartDateTime(startDateTime);
    tempTaskState?.setTempEndDateTime(endDateTime);
    tempTaskState?.setTempTaskColor(color);
    tempTaskState?.setTempNotes(notes);
  }, [name, startDateTime, endDateTime, color, notes]);

  return (
    <View className="relative h-full bg-white">
      <ScrollView
        contentContainerStyle={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
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
            <View className="flex flex-row items-center justify-between">
              <Text className="text-lg font-semibold">End:</Text>
              <View className="flex flex-row">
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
        presentationStyle="pageSheet"
      >
        <View className="flex flex-col flex-1 items-center justify-center w-full">
          <View className="flex rounded-lg bg-white flex-1 w-full mb-12">
            <ColorPicker
              selectedColor={color}
              setColor={setColor}
              setIsOpen={setModalOpen}
            />
            <CustomButton
              onPress={() => {
                setModalOpen(false);
              }}
              text="Close"
              className="rounded-t-none"
              bgColor="bg-neutral-800"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
