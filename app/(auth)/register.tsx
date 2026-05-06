import { api } from "@/src/services/api";
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

export default function RegisterScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    if (!nome || !email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos!");
      return;
    }

    setIsLoading(true);

    try {
      // Bate na rota de registro do seu AuthController (Backend)
      await api.post("/auth/register", {
        nome: nome.trim(),
        email: email.toLowerCase().trim(),
        senha: password,
      });
      Alert.alert(
        "Sucesso",
        "Conta criada com sucesso! Faça login para continuar.",
      );
      router.replace("/(auth)"); // Redireciona para a tela de login
    } catch (error: any) {
      console.error("Erro ao registrar:", error);
      // se o email já existir no MongoDB, o Node geralmente avisa
      if (error.response?.data?.error) {
        Alert.alert("Erro", error.response.data.error);
      } else {
        Alert.alert("Erro", "Não foi possível criar a conta!");
      }
    } finally {
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
        <Text style={styles.title}>Criar Conta</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome Completo"
          placeholderTextColor="#666"
          value={nome}
          onChangeText={setNome}
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          editable={!isLoading}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          editable={!isLoading}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
          <Text style={styles.link}>Já tem conta? Faça login aqui</Text>
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
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 40,
    color: "#333",
  },
  input: {
    backgroundColor: "#eee",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  errorText: {
    color: "#d32f2f",
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#28A745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#94d3a2",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    textAlign: "center",
    color: "#007bff",
    marginTop: 20,
    fontSize: 16,
    fontWeight: "600",
  },
});
