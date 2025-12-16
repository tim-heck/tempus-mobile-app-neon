import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { useContext, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { AuthContext } from "../utils/authContext";

export default function LoginScreen() {
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const result = await authContext.signUp(email, password, name);
    setLoading(false);

    if (!result.success) {
      Alert.alert("Sign Up Failed", result.error || "An error occurred");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 justify-center p-6">
        <AppText size="heading" center className="mb-2">
          Create Account
        </AppText>
        <AppText center color="secondary" className="mb-8">
          Sign up to get started
        </AppText>

        <TextInput
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
          error={errors.name}
          editable={!loading}
        />

        <TextInput
          label="Email"
          placeholder="your.email@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
          editable={!loading}
        />

        <TextInput
          label="Password"
          placeholder="At least 8 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errors.password}
          editable={!loading}
        />

        <Button
          title={loading ? "Signing up..." : "Sign Up"}
          onPress={handleSignUp}
          disabled={loading}
        />

        <AppText center color="secondary" size="small" className="mt-4">
          By signing up, you agree to our Terms of Service
        </AppText>
      </View>
    </ScrollView>
  );
}
