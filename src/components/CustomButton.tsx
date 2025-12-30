import { forwardRef } from "react";
import { TouchableOpacity, TouchableOpacityProps, View } from "react-native";

type ButtonProps = {
  type?: string;
  children: React.ReactNode;
} & TouchableOpacityProps;

export const CustomButton = forwardRef<View, ButtonProps>(
  ({ type = "primary", children, ...touchableProps }, ref) => {
    switch (type) {
      case "icon":
        return (
          <TouchableOpacity
            ref={ref}
            {...touchableProps}
            className={`${styles.iconButton} ${touchableProps.className}`}
          >
            <View>{children}</View>
          </TouchableOpacity>
        );
    }
    return (
      <TouchableOpacity
        ref={ref}
        {...touchableProps}
        className={`${styles.button} ${touchableProps.className}`}
      >
        <View>{children}</View>
      </TouchableOpacity>
    );
  }
);

const styles = {
  iconButton: "items-center p-4 bg-transparent",
  button: "items-center bg-green-600 rounded-lg shadow-md p-4",
  // buttonText: 'text-white text-lg font-semibold text-center',
};
