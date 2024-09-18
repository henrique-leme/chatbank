import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

export const scrapeInfomoneyDividendos = async () => {
  const links = [
    "https://www.infomoney.com.br/onde-investir/dividendos-em-dolar-10-bdrs-com-retorno-em-proventos-de-ate-24-projetado-nos-proximos-12-meses/",
    "https://www.infomoney.com.br/onde-investir/como-receber-dividendos-todo-mes-confira-uma-carteira-com-11-acoes-que-fazem-pagamentos-regulares/",
    "https://www.infomoney.com.br/onde-investir/viver-de-renda-como-ganhar-uma-renda-extra-mensal-de-ate-r-4-mil-com-investimentos/",
  ];

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const articles: { title: string; link: string; content: string }[] = [];

    for (let link of links) {
      await page.goto(link, { waitUntil: "networkidle2" });
      const content = await page.content();
      const $ = cheerio.load(content);

      const title = $("main h1").text().trim();

      let articleContent = "";
      $("main article p").each((i, element) => {
        articleContent += $(element).text().trim() + "\n";
      });

      articleContent = articleContent
        .replace(/Publicidade.*/, "")
        .replace(/\s{2,}/g, " ");

      articles.push({
        title,
        link,
        content: articleContent.trim(),
      });
    }

    await browser.close();

    const dataDir = path.join(process.cwd(), "src", "data");
    const filePath = path.join(dataDir, "infomoney_dividendos.json");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(articles, null, 2), "utf-8");
    console.log(`Dados salvos em ${filePath}`);

    return articles;
  } catch (error) {
    console.error(`Erro ao fazer scraping:`, error);
    return [];
  }
};
