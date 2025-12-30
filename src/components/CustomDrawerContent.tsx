import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Button } from "components/Button";
import { useContext } from "react";
import { Text, View } from "react-native";
import { AuthContext } from "utils/authContext";

export default function CustomDrawerContent(props: any) {
  const authState = useContext(AuthContext);
  return (
    <View className="flex flex-col flex-1">
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          gap: 8,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <View className="flex flex-1 mb-4">
          <Text className="text-3xl font-bold">Tempus</Text>
        </View>
        <DrawerItemList {...props} />
        <Button title="Log out" onPress={authState.logOut} theme="tertiary" />
      </DrawerContentScrollView>
    </View>
  );
}
