import { Request, Response } from "express";
import { scrapeInfomoneyCDB } from "./infoMoney/rendaFixa/infoMoneyScraperRendaFixaCDB";
import { scrapeInfomoneyLCA } from "./infoMoney/rendaFixa/infoMoneyScraperRendaFixaLCA";
import { scrapeInfomoneyLCI } from "./infoMoney/rendaFixa/infoMoneyScraperRendaFixaLCI";
import { scrapeInfomoneyTesouroDireto } from "./infoMoney/rendaFixa/infoMoneyScraperRendaFixaTesouroDireto";
import { scrapeInfomoneyFundosImobiliarios } from "./infoMoney/fundosImobiliarios/infoMoneyScraperFundoImobiliario";
import { scrapeInfomoneyFundosRendaFixa } from "./infoMoney/fundosDeInvestimento/infoMoneyScraperFundosRendaFixa";
import { scrapeInfomoneyFundosMultimercado } from "./infoMoney/fundosDeInvestimento/infoMoneyScraperFundosMultimercado";
import { scrapeInfomoneyFundosDePrevidencia } from "./infoMoney/fundosDeInvestimento/infoMoneyScraperFundosDePrevidencia";
import { scrapeInfomoneyFundosAcoes } from "./infoMoney/fundosDeInvestimento/infoMoneyScraperFundosAcoes";
import { scrapeInfomoneyDividendos } from "./infoMoney/dividendos/infoMoneyScraperDividendos";

async function testingScraper() {
  const articles = await scrapeInfomoneyDividendos();
  console.log(articles);
  return articles;
}

export const testScraper = async (req: Request, res: Response) => {
  try {
    const articles = await testingScraper();
    res.status(200).send({ articles });
  } catch (error) {
    res.status(500).send("Erro ao executar scraping.");
  }
};
