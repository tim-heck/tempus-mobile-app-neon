import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "utils/authContext";
import { CalendarProvider } from "utils/calendarContext";
import { TempTaskProvider } from "utils/tempTaskContext";
import "../../global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <CalendarProvider>
        <TempTaskProvider>
          <Stack>
            <Stack.Screen
              name="(protected)"
              options={{
                headerShown: false,
                animation: "none",
              }}
            />
            <Stack.Screen
              name="login"
              options={{
                headerShown: false,
                animation: "none",
              }}
            />
          </Stack>
        </TempTaskProvider>
      </CalendarProvider>
    </AuthProvider>
  );
}
