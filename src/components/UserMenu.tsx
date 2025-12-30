import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

interface UserMenuProps {
  setIsOpen: (isOpen: boolean) => void;
}

export default function UserMenu({ setIsOpen }: UserMenuProps) {
  return (
    <View className="absolute right-2 top-full flex w-[100px] flex-col items-center justify-center gap-2 rounded-md border-2 border-black bg-white">
      <View className="flex w-full items-center">
        <Link href="/login" push asChild>
          <Pressable className="flex flex-row items-center justify-between p-2">
            <Text className="text-lg font-semibold">Login</Text>
          </Pressable>
        </Link>
        <View className="h-0.5 w-full bg-black" />
        <Pressable
          className="flex flex-row items-center justify-between p-2"
          onPress={() => setIsOpen(false)}
        >
          <Text className="text-lg font-semibold">Close</Text>
        </Pressable>
      </View>
    </View>
  );
}
