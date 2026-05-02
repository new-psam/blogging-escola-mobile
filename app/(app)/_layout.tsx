import { RootState } from "@/src/store";
import { Redirect, Stack } from "expo-router";
import { useSelector } from "react-redux";

export default function AppLayout() {
  // Pegamos o estado atual do usuário logado direto do redux
  const user = useSelector((state: RootState) => state.auth.user);

  // Se não tiver usuário (null), redireciona ppara o fluxo auth
  if (!user) {
    // O expo  Router vai jogar o usuário para a rota raiz, que cai no login
    return <Redirect href="/(auth)" />;
  }

  // Se tiver usuário, mostra a área logada (tabs) acesso as área filhas
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
