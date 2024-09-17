import { scrapeInfomoneyDividendos } from "./scrapers/infoMoney/dividendos/infoMoneyScraperDividendos";
import { scrapeInfomoneyFundosAcoes } from "./scrapers/infoMoney/fundosDeInvestimento/infoMoneyScraperFundosAcoes";
import { scrapeInfomoneyFundosDePrevidencia } from "./scrapers/infoMoney/fundosDeInvestimento/infoMoneyScraperFundosDePrevidencia";
import { scrapeInfomoneyFundosMultimercado } from "./scrapers/infoMoney/fundosDeInvestimento/infoMoneyScraperFundosMultimercado";
import { scrapeInfomoneyFundosRendaFixa } from "./scrapers/infoMoney/fundosDeInvestimento/infoMoneyScraperFundosRendaFixa";
import { scrapeInfomoneyFundosImobiliarios } from "./scrapers/infoMoney/fundosImobiliarios/infoMoneyScraperFundoImobiliario";
import { scrapeInfomoneyCarreira } from "./scrapers/infoMoney/infomoneyScraperCarreira";
import { scrapeInfomoneyGuiaFinancasPessoais } from "./scrapers/infoMoney/infoMoneyScraperGuiasFinancasPessoais";
import { scrapeInfomoneyGuiaInvestimentos } from "./scrapers/infoMoney/infoMoneyScraperGuiasInvestimentos";
import { scrapeInfomoneyDebentures } from "./scrapers/infoMoney/rendaFixa/infoMoneyScraperDebentures";
import { scrapeInfomoneyCDB } from "./scrapers/infoMoney/rendaFixa/infoMoneyScraperRendaFixaCDB";
import { scrapeInfomoneyLCA } from "./scrapers/infoMoney/rendaFixa/infoMoneyScraperRendaFixaLCA";
import { scrapeInfomoneyLCI } from "./scrapers/infoMoney/rendaFixa/infoMoneyScraperRendaFixaLCI";
import { scrapeInfomoneyTesouroDireto } from "./scrapers/infoMoney/rendaFixa/infoMoneyScraperRendaFixaTesouroDireto";

export const runScrapingForDividendos = async () => {
  const data = await scrapeInfomoneyDividendos();
  return data;
};

export const runScrapingForFundosDeInvestimento = async () => {
  const fundosAcoesData = await scrapeInfomoneyFundosAcoes();
  const fundosPrevidenciaData = await scrapeInfomoneyFundosDePrevidencia();
  const fundosMultimercadoData = await scrapeInfomoneyFundosMultimercado();
  const fundosRendaFixaData = await scrapeInfomoneyFundosRendaFixa();

  return [
    ...fundosAcoesData,
    ...fundosPrevidenciaData,
    ...fundosMultimercadoData,
    ...fundosRendaFixaData,
  ];
};

export const runScrapingForFundosImobiliarios = async () => {
  const data = await scrapeInfomoneyFundosImobiliarios();
  return data;
};

export const runScrapingForRendaFixa = async () => {
  const debenturesData = await scrapeInfomoneyDebentures();
  const cdbData = await scrapeInfomoneyCDB();
  const lcaData = await scrapeInfomoneyLCA();
  const lciData = await scrapeInfomoneyLCI();
  const tesouroDiretoData = await scrapeInfomoneyTesouroDireto();

  return [
    ...debenturesData,
    ...cdbData,
    ...lcaData,
    ...lciData,
    ...tesouroDiretoData,
  ];
};

export const runScrapingForGuias = async () => {
  const carreiraData = await scrapeInfomoneyCarreira();
  const guiasFinancasPessoaisData = await scrapeInfomoneyGuiaFinancasPessoais();
  const guiasInvestimentosData = await scrapeInfomoneyGuiaInvestimentos();

  return [
    ...carreiraData,
    ...guiasFinancasPessoaisData,
    ...guiasInvestimentosData,
  ];
};
