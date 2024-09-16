import { Router } from "express";
import {
  runAndSaveDividendos,
  runAndSaveFundosDeInvestimento,
  runAndSaveFundosImobiliarios,
  runAndSaveRendaFixa,
  runAndSaveGuias,
  listScrapedData,
} from "../controllers/scrapingController";

const router = Router();

router.get("/dividendos", runAndSaveDividendos);
router.get("/fundos-investimento", runAndSaveFundosDeInvestimento);
router.get("/fundos-imobiliarios", runAndSaveFundosImobiliarios);
router.get("/renda-fixa", runAndSaveRendaFixa);
router.get("/guias", runAndSaveGuias);
router.get("/list/:collection", listScrapedData);

export default router;
