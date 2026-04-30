import { auth, db } from "@/src/services/firebase";
import { setRole, setUser } from "@/src/store/slices/authSlice";
import { useRouter } from "expo-router";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useDispatch } from "react-redux";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    // Limpa erros antigos ao tentar de novo
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Por favor, preencha todos os campos!");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Faz o login no Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // 2. Busca o papel (role) do usuário do Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      let userRole: "student" | "teacher" | "admin" | null = null;

      if (userDoc.exists()) {
        userRole = userDoc.data().role;
      }

      // 3. Salva os dados no Redux
      dispatch(setUser({ uid: user.uid, email: user.email }));
      dispatch(setRole(userRole));

      // 4. Redireciona para a área logada (Home)
      router.replace("/(tabs)");
    } catch (error: unknown) {
      // Aqui nós verificamos se o erro unknown é, de fato, um erro do Firebase
      if (error instanceof FirebaseError) {
        // Podemos mapear os códigos de Firebase para mensagens em Português
        switch (error.code) {
          case "auth/invalid-credential":
            setErrorMessage("E-mail ou senha incorretos.");
            break;
          case "auth/invalid-email":
            setErrorMessage("O formato de email é inválido.");
            break;
          case "auth/too-many-requests":
            setErrorMessage(
              "Muitas tentativas de falhas. Tente novamente mais tarde.",
            );
            break;
          default:
            setErrorMessage("Erro ao fazer o Login. Tente Novamente.");
        }
      } else {
        // Se for um erro genérico (ex: sem internet)
        setErrorMessage("Ocorreu um erro inesperado.");
      }
    } finally {
      // Independetemente de dar certo ou errado, paramos o loading
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blogging Escola</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!isLoading}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />

      {/* Renderização condicional do erro: só aparece se houver texto  */}
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

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
        onPress={() => router.push("./(auth)/register")}
        disabled={isLoading}
      >
        <Text style={styles.link}>Não tem conta? Cadastre-se aqui</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {},
  input: {},
  errorText: {},
  button: {},
  buttonDisabled: {},
  buttonText: {},
  link: {},
});
