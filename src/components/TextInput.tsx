import React from "react";
import { TextInput as RNTextInput, TextInputProps, View } from "react-native";
import { cn } from "utils/cn";
import { AppText } from "./AppText";

type CustomTextInputProps = TextInputProps & {
  label?: string;
  error?: string;
  className?: string;
};

export function TextInput({
  label,
  error,
  className,
  ...rest
}: CustomTextInputProps) {
  return (
    <View className="">
      {label && <AppText className="mb-2 font-semibold">{label}</AppText>}
      <RNTextInput
        className={cn(
          "border border-gray-300 rounded-md bg-neutral-200 p-4 text-lg font-semibold leading-tight",
          error && "border-red-500",
          className
        )}
        placeholderTextColor="#999"
        {...rest}
      />
      {error && (
        <AppText color="tertiary" size="small" className="text-red-500 mt-1">
          {error}
        </AppText>
      )}
    </View>
  );
}
