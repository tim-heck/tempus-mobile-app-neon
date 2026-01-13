import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { authClient } from "lib/auth-client";
import { useContext } from "react";
import { Text, View } from "react-native";
import { AuthContext } from "utils/authContext";
import { CustomButton } from "./CustomButton";

export default function CustomDrawerContent(props: any) {
  const authState = useContext(AuthContext);
  const { data: session } = authClient.useSession();

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
        <View className="flex flex-1 mb-4 justify-center flex-row items-center">
          <Text className="text-3xl font-bold">Tempus</Text>
        </View>
        <View className="flex flex-1 mb-4 justify-center flex-row items-center">
          <View className="flex flex-row items-center">
            <Text className="text-xl font-normal">Hello,</Text>
            <Text className="text-xl font-bold"> {session?.user?.name}</Text>
          </View>
        </View>
        <DrawerItemList {...props} />
        <CustomButton
          type="tertiary"
          onPress={authState.logOut}
          text="Log out"
        />
      </DrawerContentScrollView>
    </View>
  );
}
