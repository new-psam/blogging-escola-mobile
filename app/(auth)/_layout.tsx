import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* O index.tsx será nossa tela de login */}
      <Stack.Screen name="index" />
      {/* O register.tsx será nossa tela de Cadastro */}
      <Stack.Screen name="register" />
    </Stack>
  );
}
