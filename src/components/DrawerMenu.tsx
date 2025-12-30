import { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1 flex-row">
        {/* Backdrop */}
        <Pressable className="flex-1 bg-black/50" onPress={onClose} />

        {/* Drawer */}
        <Animated.View
          style={{
            transform: [{ translateX: slideAnim }],
            width: 300,
          }}
          className="bg-white shadow-lg"
        >
          <View className="flex-1 p-4 pt-12">
            <TouchableOpacity
              onPress={() => {
                console.log("One pressed");
                onClose();
              }}
              className="py-4 border-b border-gray-200"
            >
              <Text className="text-lg font-semibold">One</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                console.log("Two pressed");
                onClose();
              }}
              className="py-4 border-b border-gray-200"
            >
              <Text className="text-lg font-semibold">Two</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                console.log("Three pressed");
                onClose();
              }}
              className="py-4"
            >
              <Text className="text-lg font-semibold">Three</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
