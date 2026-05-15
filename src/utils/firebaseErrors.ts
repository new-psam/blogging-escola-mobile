// src/utils/firebaseErrors.ts

export function getFirebaseErrorMessage(errorCode: string): string {
  switch (errorCode) {
    // Erros de Login
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "E-mail ou senha incorretos. Verifique seus dados e tente novamente.";

    // Erros Gerais e de Cadastro
    case "auth/invalid-email":
      return "O formato do e-mail digitado é inválido.";
    case "auth/email-already-in-use":
      return "Este e-mail já está cadastrado em nosso sistema.";
    case "auth/weak-password":
      return "A senha é muito fraca. Digite pelo menos 6 caracteres.";

    // Erros de Sistema/Rede
    case "auth/too-many-requests":
      return "Muitas tentativas falhas. Por segurança, aguarde alguns minutos e tente novamente.";
    case "auth/network-request-failed":
      return "Falha de conexão. Verifique sua internet e tente novamente.";

    // Erro Padrão (Fallback)
    default:
      return "Ocorreu um erro inesperado. Tente novamente mais tarde.";
  }
}
