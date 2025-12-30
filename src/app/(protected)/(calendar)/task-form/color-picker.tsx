import { router } from "expo-router";
import { useContext } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { taskBaseColors } from "utils/constants";
import TempTaskContext from "utils/tempTaskContext";

export default function ColorPicker() {
  const tempTaskState = useContext(TempTaskContext);

  return (
    <FlatList
      data={Object.values(taskBaseColors)}
      className="flex flex-col gap-2"
      ItemSeparatorComponent={() => (
        <View className="h-0.5 w-full bg-neutral-50" />
      )}
      renderItem={({ item, index }) => {
        return (
          <TouchableOpacity
            className={`flex flex-row items-center justify-between p-4 ${tempTaskState?.tempTaskColor.value === item.value ? "bg-neutral-800" : item.value}`}
            onPress={() => {
              if (router.canGoBack()) {
                tempTaskState?.setTempTaskColor(item);
                router.back();
              }
            }}
          >
            <Text
              className={`text-lg font-semibold ${tempTaskState?.tempTaskColor.value === item.value ? item.text : "text-white"}`}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}
