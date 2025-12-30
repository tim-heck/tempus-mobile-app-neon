import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Button } from "components/Button";
import { Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useContext } from "react";
import { AuthContext } from "../../utils/authContext";

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const authState = useContext(AuthContext);
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <Button title="Log out!" onPress={authState.logOut} />
    </DrawerContentScrollView>
  );
};

export default function ProtectedLayout() {
  const authState = useContext(AuthContext);

  if (!authState.isReady) {
    return null;
  }

  if (!authState.isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <Drawer
      screenOptions={{ drawerPosition: "right" }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="(calendar)"
        options={{
          drawerLabel: "Calendar",
          headerShown: false,
        }}
      />
    </Drawer>
  );
}
