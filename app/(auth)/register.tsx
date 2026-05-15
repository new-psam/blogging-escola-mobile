import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

// Importações novas do Firebase
import { auth } from "@/src/config/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { api } from "@/src/services/api";
import { getFirebaseErrorMessage } from "@/src/utils/firebaseErrors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    if (!nome || !email || !password) {
      return Alert.alert("Erro", "Por favor, preencha todos os campos!");
    }

    setIsLoading(true);

    try {
      // 1. Cria a conta no Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.toLocaleLowerCase().trim(),
        password,
      );

      // 2. (opcional) salva o nome no próprio firebase
      await updateProfile(userCredential.user, { displayName: nome.trim() });

      // 3.   Avisa o Node.js para salvar o perfil no MOngoDB
      // Manda-se um UID do Firebase para o Node saber que é quem
      await api.post("/auth/register", {
        nome: nome.trim(),
        email: email.toLocaleLowerCase().trim(),
        role: "aluno", // Todo cadastro público cai como aluno por padrão
        firebaseUid: userCredential.user.uid,
      });

      Alert.alert(
        "Sucesso",
        "Conta criada com sucesso! Faça login para continuar.",
      );
      router.replace("/(auth)"); // Redireciona para a tela de login
    } catch (error: any) {
      //console.error("Erro ao registrar - Firebase?:", error.code);
      const mensagemAmigavel = getFirebaseErrorMessage(error.code);
      Alert.alert("Erro", mensagemAmigavel);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <Image
                // AJUSTE O CAMINHO RELATIVO SE NECESSÁRIO
                source={require("../../assets/images/splash-icon.png")}
                style={styles.logo}
                resizeMode="contain" // 🌟 Mantém a proporção sem esticar
              />
            </View>
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

            <TouchableOpacity
              onPress={() => router.back()}
              disabled={isLoading}
            >
              <Text style={styles.link}>Já tem conta? Faça login aqui</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center", // Centraliza horizontalmente
    marginBottom: 10, // Espaço entre a logo e o título
  },
  logo: {
    width: 200, // Defina uma largura maior que o ícone do header
    height: 150, // Ajuste a altura proporcionalmente
    // Se sua imagem original tiver um fundo cinza e você quiser que ele suma,
    // você pode tentar usar a propriedade tintColor, mas só funciona se o logo
    // for monocromático. Como o seu tem cores (laranja, azul), o ideal é usar
    // um PNG com fundo transparente.
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
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
