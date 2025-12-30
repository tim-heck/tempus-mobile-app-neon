import CustomDrawerContent from "components/CustomDrawerContent";
import { Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useContext } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthContext } from "../../utils/authContext";

export default function ProtectedLayout() {
  const authState = useContext(AuthContext);

  if (!authState.isReady) {
    return null;
  }

  if (!authState.isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerPosition: "right",
          drawerHideStatusBarOnOpen: true,
          drawerActiveBackgroundColor: "#262626",
          drawerActiveTintColor: "#ffffff",
          drawerItemStyle: { borderRadius: 6 },
          drawerLabelStyle: { fontSize: 16 },
        }}
      >
        <Drawer.Screen
          name="(calendar)"
          options={{
            drawerLabel: "Calendar",
            headerShown: false,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
