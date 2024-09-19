import axios from "axios";

export const getAIResponse = async (message: string): Promise<string> => {
  try {
    const response = await axios.post(
      "https://ollama.com/api/tim2nearfield/finance",
      {
        prompt: message,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.reply;
  } catch (error) {
    console.error("Erro ao obter resposta da IA:", error);
    throw new Error("Falha ao conectar com o serviço de IA.");
  }
};
