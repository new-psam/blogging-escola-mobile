import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../src/store";

export default function RootLayout() {
  return (
    // Provider injeta o Redux em todas as rotas do aplicativo
    <Provider store={store}>
      {/* O Stack sem headerShown esconde aquele cabeçalho global padrão */}
      <Stack screenOptions={{ headerShown: false }} />
    </Provider>
  );
}
