import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

export const scrapeInfomoneyFundosImobiliarios = async () => {
  const links = [
    "https://www.infomoney.com.br/guias/fundos-imobiliarios-tijolo-papel-hibrido/",
    "https://www.infomoney.com.br/guias/o-que-e-ifix/",
    "https://www.infomoney.com.br/guias/vacancia-em-fundos-imobiliarios/",
    "https://www.infomoney.com.br/guias/cap-rate/",
  ];

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const articles: { title: string; link: string; content?: string }[] = [];

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
        .replace(/Publicidade/g, "")
        .replace(/\s{2,}/g, " ");

      articles.push({
        title,
        link,
        content: articleContent.trim(),
      });
    }

    await browser.close();

    const dataDir = path.join(process.cwd(), "src", "data");
    const filePath = path.join(dataDir, "infomoney_fundos_imobiliarios.json");

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
