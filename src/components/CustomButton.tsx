import { forwardRef } from "react";
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

type ButtonProps = {
  type?: string;
  text?: string;
  icon?: React.ReactNode;
  iconRight?: boolean;
  bgColor?: string;
  children?: React.ReactNode;
} & TouchableOpacityProps;

export const CustomButton = forwardRef<View, ButtonProps>(
  (
    {
      type = "primary",
      text = "",
      icon,
      iconRight = false,
      bgColor = "bg-teal-500",
      children,
      ...touchableProps
    },
    ref
  ) => {
    switch (type) {
      case "icon":
        return (
          <TouchableOpacity
            ref={ref}
            {...touchableProps}
            className={`${styles.iconButton} ${touchableProps.className}`}
          >
            <View className="flex flex-row items-center gap-2">
              {!iconRight && <View>{icon}</View>}
              {text.length && (
                <Text className="text-xl font-semibold">{text}</Text>
              )}
              {iconRight && <View>{icon}</View>}
            </View>
          </TouchableOpacity>
        );
      case "secondary":
        return (
          <TouchableOpacity
            ref={ref}
            {...touchableProps}
            className={`items-center ${bgColor} rounded-lg shadow-md p-3 ${touchableProps.className}`}
          >
            <Text className="text-white font-semibold text-lg">{text}</Text>
          </TouchableOpacity>
        );
      case "tertiary":
        return (
          <TouchableOpacity
            ref={ref}
            {...touchableProps}
            className={`items-center rounded-lg shadow-md p-3 ${touchableProps.className}`}
          >
            <Text className="text-black font-semibold text-lg">{text}</Text>
          </TouchableOpacity>
        );
      default:
        return (
          <TouchableOpacity
            ref={ref}
            {...touchableProps}
            className={`items-center ${bgColor} rounded-lg shadow-md p-3 ${touchableProps.className}`}
          >
            <Text className="text-white font-semibold text-lg">{text}</Text>
          </TouchableOpacity>
        );
    }
  }
);

const styles = {
  iconButton: "items-center p-4 bg-transparent",
};
