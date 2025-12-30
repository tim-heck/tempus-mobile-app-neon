import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { ColorMenuItem } from "types";
import { taskBaseColors } from "utils/constants";

type ColorPickerProps = {
  selectedColor: ColorMenuItem;
  setColor: (color: ColorMenuItem) => void;
  setIsOpen: (isOpen: boolean) => void;
};

export default function ColorPicker({
  selectedColor,
  setColor,
  setIsOpen,
}: ColorPickerProps) {
  return (
    <FlatList
      data={Object.values(taskBaseColors)}
      className="flex flex-col gap-2 flex-1"
      ItemSeparatorComponent={() => (
        <View className="h-0.5 w-full bg-neutral-50" />
      )}
      renderItem={({ item, index }) => {
        return (
          <TouchableOpacity
            className={`flex flex-row items-center justify-between p-4 flex-1 w-full ${selectedColor.value === item.value ? "bg-neutral-800" : item.value}`}
            onPress={() => {
              setColor(item);
              setIsOpen(false);
            }}
          >
            <Text
              className={`text-lg font-semibold ${selectedColor.value === item.value ? item.text : "text-white"}`}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}
