import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Task Form", headerShown: false }}
      />
      <Stack.Screen name="color-picker" options={{ title: "" }} />
    </Stack>
  );
}
