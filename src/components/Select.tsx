import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { ReactNode, useReducer } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const openSelectReducer = (open: boolean) => !open;

export interface Selection {
  label: string;
  value: string;
  icon?: ReactNode;
}

interface SelectProps {
  options: { [key: string]: Selection };
  currentValue: Selection;
  onValueChange: ((view: Selection) => void) | undefined;
  maxHeight?: number;
  border?: boolean;
  borderColor?: string; // Tailwind bg class
  innerLabel?: boolean;
  bgColor?: string; // Tailwind bg class
}

export default function Select({
  options,
  currentValue,
  onValueChange,
  maxHeight,
  border,
  borderColor,
  innerLabel,
  bgColor = "bg-white",
}: SelectProps) {
  const [open, dispatch] = useReducer(openSelectReducer, false);

  const selectOption = (value: Selection) => {
    if (typeof onValueChange === "function") {
      onValueChange(value);
      dispatch();
    }
  };

  return (
    <View className="relative">
      <TouchableWithoutFeedback onPress={() => dispatch()}>
        <View
          className={`flex flex-row items-center gap-2 rounded-md p-2 ${bgColor} ${borderColor ? "border-2 " + borderColor : ""}`}
        >
          {innerLabel && <Text>{currentValue.label}</Text>}
          {currentValue.icon && (
            <View className="flex flex-row items-center gap-2">
              {currentValue.icon}
            </View>
          )}
          {!open ? (
            <FontAwesome5 name="caret-down" size={20} color="black" />
          ) : (
            <FontAwesome5 name="caret-up" size={20} color="black" />
          )}
        </View>
      </TouchableWithoutFeedback>
      {open && (
        <View
          className="absolute top-full z-10 mb-2 w-32 self-center rounded-md border-2 border-black bg-white"
          style={{ maxHeight: maxHeight || "auto" }}
        >
          <FlatList
            data={Object.values(options)}
            className="flex flex-col gap-2"
            ItemSeparatorComponent={() => (
              <View className="h-0.5 w-full bg-black" />
            )}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  className="flex flex-row items-center justify-between p-2"
                  onPress={() => selectOption(item)}
                >
                  <Text className="text-lg font-semibold">{item.label}</Text>
                  {item.icon && <View>{item.icon}</View>}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
    </View>
  );
}
