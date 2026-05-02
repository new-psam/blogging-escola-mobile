import { auth, db } from "@/src/services/firebase";
import { setRole, setUser } from "@/src/store/slices/authSlice";
import { useRouter } from "expo-router";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useDispatch } from "react-redux";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleRegister = async () => {
    // Limpa erros antigos ao tentar de novo
    setErrorMessage("");

    if (!name || !email || !password) {
      setErrorMessage("Por favor, preencha todos os campos!");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("A senha deve conter pelo menos 6 caracteres!");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Cria o usuário no Firease Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // 2. Salva os dados extras no Firestore (com papel padrão de 'student')
      const defaultRole = "student";
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: user.email,
        role: defaultRole,
        createdAt: new Date(),
      });

      // 3. Salva os dados no Redux
      dispatch(setUser({ uid: user.uid, email: user.email }));
      dispatch(setRole(defaultRole));

      // 4. Redireciona para a área logada (Home)
      router.replace("/(app)/(tabs)");
    } catch (error: unknown) {
      // Cole esta linha aqui para vermos o erro real no terminal do VS Code:
      console.log("🔥 ERRO REAL NO CADASTRO:", error);
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            setErrorMessage("Este e-mail já está em uso.");
            break;
          case "auth/invalid-email":
            setErrorMessage("O formato de e-mail é inválido.");
            break;
          case "auth/weak-password":
            setErrorMessage("A senha é muito fraca.");
            break;
          default:
            setErrorMessage("Erro ao criar conta. Tente Novamente.");
        }
      } else {
        setErrorMessage("Ocorreu um erro inesperado. Tente Novamente.");
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
          value={name}
          onChangeText={setName}
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          editable={!isLoading}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          editable={!isLoading}
          secureTextEntry
        />

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

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
    backgroundColor: "#fff",
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
