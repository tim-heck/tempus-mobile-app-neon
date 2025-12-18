import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000", // Base URL of your Better Auth backend.
  fetchOptions: {
    credentials: "include",
    headers: {
      Origin: "tempus://",
    },
  },
  plugins: [
    expoClient({
      scheme: "tempus",
      storagePrefix: "tempus",
      storage: SecureStore,
    }),
  ],
});
