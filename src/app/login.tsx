import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { useContext, useState } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { AuthContext } from "../utils/authContext";

export default function LoginScreen() {
  const authContext = useContext(AuthContext);
  const [isSignUp, setIsSignUp] = useState(false);
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

    if (isSignUp && !name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const result = isSignUp
      ? await authContext.signUp(email, password, name)
      : await authContext.logIn(email, password);
    console.log(result);
    setLoading(false);

    if (!result.success) {
      Alert.alert(
        isSignUp ? "Sign Up Failed" : "Login Failed",
        result.error || "An error occurred"
      );
    }
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail("");
    setPassword("");
    setName("");
    setErrors({});
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 justify-center p-6">
        <AppText size="heading" center className="mb-2">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </AppText>
        <AppText center color="secondary" className="mb-8">
          {isSignUp ? "Sign up to get started" : "Log in to your account"}
        </AppText>

        {isSignUp && (
          <TextInput
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            error={errors.name}
            editable={!loading}
          />
        )}

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
          placeholder={
            isSignUp ? "At least 8 characters" : "Enter your password"
          }
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errors.password}
          editable={!loading}
        />

        <Button
          title={
            loading
              ? isSignUp
                ? "Signing up..."
                : "Logging in..."
              : isSignUp
                ? "Sign Up"
                : "Log In"
          }
          onPress={handleSubmit}
          disabled={loading}
        />

        <View className="mt-6 flex-row justify-center">
          <AppText center color="secondary" size="small">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
          </AppText>
          <Pressable onPress={handleToggleMode} disabled={loading}>
            <AppText
              center
              color="secondary"
              size="small"
              className="font-semibold underline"
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </AppText>
          </Pressable>
        </View>

        {isSignUp && (
          <AppText center color="secondary" size="small" className="mt-4">
            By signing up, you agree to our Terms of Service
          </AppText>
        )}
      </View>
    </ScrollView>
  );
}
