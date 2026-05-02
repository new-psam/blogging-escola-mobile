import { auth } from "@/src/services/firebase";
import { logoutApp } from "@/src/store/slices/authSlice";
import { signOut } from "firebase/auth";
import { Button, StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";

export default function HomeScreen() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // 1. Avisa o Firebase para encerrar a sessão no celular
      await signOut(auth);

      // 2. Limpa os dados do usuário no Redux (opcional, pois o listener do Firebase já cuida disso)
      dispatch(logoutApp());
      // MÁGICA: Não precisamos usar o router.replace () aqui!
      // Assim que o Redux ficar vazio, o nosso _layout.tsx vai redirecionar o usuário para a tela de login automaticamente.
    } catch (error) {
      console.error("Erro ao fazer logout:, error");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Blogging Escola!</Text>

      {/* Botão de sair chamando a nossa função de logout */}
      <Button title="Sair da Conta" onPress={handleLogout} color="#d32f2f" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
  },
});
