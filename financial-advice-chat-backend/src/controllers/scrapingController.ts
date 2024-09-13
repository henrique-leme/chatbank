import { Request, Response } from "express";
import {
  runScrapingForDividendos,
  runScrapingForFundosDeInvestimento,
  runScrapingForFundosImobiliarios,
  runScrapingForRendaFixa,
  runScrapingForGuias,
} from "../scraping";
import { getScrapedData, saveScrapedData } from "../services/scrapingService";
import { saveDatasetToFile } from "../services/fileService";
import { z } from "zod";

const collectionSchema = z.enum([
  "dividendos",
  "fundos_de_investimento",
  "fundos_imobiliarios",
  "renda_fixa",
  "guias",
]);

export const runAndSaveDividendos = async (req: Request, res: Response) => {
  try {
    const dividendos = await runScrapingForDividendos();

    if (!Array.isArray(dividendos)) {
      return res.status(500).send("Erro: dados de scraping inválidos.");
    }

    await saveScrapedData(dividendos, "dividendos");
    saveDatasetToFile(dividendos, "dividendos_dataset.json");

    res
      .status(200)
      .send("Scraping de dividendos executado e dados salvos com sucesso.");
  } catch (error) {
    console.error("Erro ao executar scraping de dividendos:", error);
    res.status(500).send("Erro ao executar scraping de dividendos.");
  }
};

export const runAndSaveFundosDeInvestimento = async (
  req: Request,
  res: Response
) => {
  try {
    const fundosInvestimento = await runScrapingForFundosDeInvestimento();

    if (!Array.isArray(fundosInvestimento)) {
      return res.status(500).send("Erro: dados de scraping inválidos.");
    }

    await saveScrapedData(fundosInvestimento, "fundos_de_investimento");
    saveDatasetToFile(
      fundosInvestimento,
      "fundos_de_investimento_dataset.json"
    );

    res
      .status(200)
      .send(
        "Scraping de fundos de investimento executado e dados salvos com sucesso."
      );
  } catch (error) {
    console.error(
      "Erro ao executar scraping de fundos de investimento:",
      error
    );
    res
      .status(500)
      .send("Erro ao executar scraping de fundos de investimento.");
  }
};

export const runAndSaveFundosImobiliarios = async (
  req: Request,
  res: Response
) => {
  try {
    const fundosImobiliarios = await runScrapingForFundosImobiliarios();

    if (!Array.isArray(fundosImobiliarios)) {
      return res.status(500).send("Erro: dados de scraping inválidos.");
    }

    await saveScrapedData(fundosImobiliarios, "fundos_imobiliarios");
    saveDatasetToFile(fundosImobiliarios, "fundos_imobiliarios_dataset.json");

    res
      .status(200)
      .send(
        "Scraping de fundos imobiliários executado e dados salvos com sucesso."
      );
  } catch (error) {
    console.error("Erro ao executar scraping de fundos imobiliários:", error);
    res.status(500).send("Erro ao executar scraping de fundos imobiliários.");
  }
};

export const runAndSaveRendaFixa = async (req: Request, res: Response) => {
  try {
    const rendaFixa = await runScrapingForRendaFixa();

    if (!Array.isArray(rendaFixa)) {
      return res.status(500).send("Erro: dados de scraping inválidos.");
    }

    await saveScrapedData(rendaFixa, "renda_fixa");
    saveDatasetToFile(rendaFixa, "renda_fixa_dataset.json");

    res
      .status(200)
      .send("Scraping de renda fixa executado e dados salvos com sucesso.");
  } catch (error) {
    console.error("Erro ao executar scraping de renda fixa:", error);
    res.status(500).send("Erro ao executar scraping de renda fixa.");
  }
};

export const runAndSaveGuias = async (req: Request, res: Response) => {
  try {
    const guias = await runScrapingForGuias();

    if (!Array.isArray(guias)) {
      return res.status(500).send("Erro: dados de scraping inválidos.");
    }

    await saveScrapedData(guias, "guias");
    saveDatasetToFile(guias, "guias_dataset.json");

    res
      .status(200)
      .send("Scraping de guias executado e dados salvos com sucesso.");
  } catch (error) {
    console.error("Erro ao executar scraping de guias:", error);
    res.status(500).send("Erro ao executar scraping de guias.");
  }
};

export const listScrapedData = async (req: Request, res: Response) => {
  try {
    const collectionName = req.params.collection;
    const validationResult = collectionSchema.safeParse(collectionName);

    if (!validationResult.success) {
      return res.status(400).send("Erro: nome da coleção inválido.");
    }

    const scrapedData = await getScrapedData(collectionName);

    if (!scrapedData || scrapedData.length === 0) {
      return res
        .status(404)
        .send(`Nenhum dado encontrado na coleção: ${collectionName}.`);
    }

    res.status(200).json(scrapedData);
  } catch (error) {
    console.error(`Erro ao listar dados de ${req.params.collection}:`, error);
    res.status(500).send(`Erro ao listar dados de ${req.params.collection}.`);
  }
};
