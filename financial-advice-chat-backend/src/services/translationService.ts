import axios from "axios";
import { config } from "../config/envConfig";

const splitText = (text: string, maxLength: number): string[] => {
  const regex = new RegExp(`(.|[\r\n]){1,${maxLength}}`, "g");
  return text.match(regex) || [];
};

const translateWithDeepL = async (text: string): Promise<string> => {
  try {
    const response = await axios.post(
      "https://api-free.deepl.com/v2/translate",
      new URLSearchParams({
        auth_key: config.deeplApiKey,
        text: text,
        target_lang: "PT",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    return response.data.translations[0].text;
  } catch (error) {
    console.error(
      "Erro ao traduzir com DeepL:",
      (error as any).response?.data || (error as any).message
    );
    throw new Error("Falha ao traduzir com DeepL.");
  }
};

const translateWithLibreTranslate = async (text: string): Promise<string> => {
  const textBlocks = splitText(text, 2000);
  const translatedBlocks: string[] = [];

  try {
    for (const block of textBlocks) {
      const response = await axios.post(
        "https://libretranslate.de/translate",
        {
          q: block,
          source: "en",
          target: "pt",
          format: "text",
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      translatedBlocks.push(response.data.translatedText);
    }
    //
    return translatedBlocks.join(" ");
  } catch (error) {
    console.error(
      "Erro ao traduzir com LibreTranslate:",
      (error as any).response?.data || (error as any).message
    );
    throw new Error("Falha ao traduzir com LibreTranslate.");
  }
};

export const translateTextToPortuguese = async (
  text: string
): Promise<string> => {
  try {
    return await translateWithDeepL(text);
  } catch (deeplError) {
    console.warn("Tentando tradução com API alternativa...");

    try {
      return await translateWithLibreTranslate(text);
    } catch (libreError) {
      console.error(
        "Erro ao traduzir com ambas as APIs. Retornando o texto original."
      );
      return text;
    }
  }
};
