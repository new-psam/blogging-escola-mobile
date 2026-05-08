import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

import { auth } from "@/src/config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import { api } from "@/src/services/api";
import { loginSuccess } from "@/src/store/slices/authSlice";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);

    try {
      //1. O Firebase (Segurança) verifica a senha e libera acesso
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.toLocaleLowerCase().trim(),
        password,
      );

      //2. pegamos o crachá (Token) que o Firebase gerou
      const token = await userCredential.user.getIdToken();
      await AsyncStorage.setItem("@app_token", token);

      // 🌟 A MARRETA DO TECH LEAD: Força a API a usar o token novo imediatamente!
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // 3. Batemos no Node.js (RH) para pegar o perfil (Nome e Role) usando o token
      const response = await api.get("/auth/me");

      const user = response.data;

      // 4. Atualiza o estado global do Redux com os dados do usuário e token
      dispatch(loginSuccess({ user, token }));

      // 5. Redireciona para a tela principal do app
      router.replace("/(app)/(tabs)");
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      //Tratamento de erros amigável do Firebase
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found"
      ) {
        Alert.alert("Erro", "E-mail ou senha incorretos");
      } else if (error.response?.status === 404) {
        Alert.alert(
          "Erro",
          "Usuário autenticado, mas perfil não encontrado no banco de dados.",
        );
      } else {
        Alert.alert("Erro", "Falha ao fazer login. Tente novamente.");
      }
    } finally {
      // Independetemente de dar certo ou errado, paramos o loading
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Blogging Escola</Text>
        <Text style={styles.subtitle}>Faça login para continuar</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => router.push("./(auth)/register")}
          disabled={isLoading}
        >
          <Text style={styles.linkText}>Não tem conta? Cadastre-se aqui</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#80bdff",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  link: {
    textAlign: "center",
    color: "#007bff",
    marginTop: 20,
    fontWeight: "600",
    fontSize: 16,
  },
  linkButton: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: "#007bff",
    fontWeight: "600",
    fontSize: 16,
  },
});
