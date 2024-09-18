import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

export const scrapeInfomoneyGuiaInvestimentos = async () => {
  const url = "https://www.infomoney.com.br/trilha/investimentos/";

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const content = await page.content();
    const $ = cheerio.load(content);

    const guides: { title: string; link: string; content?: string }[] = [];

    $(".carousel").parent().remove();

    $("article.position-relative").each((i, element) => {
      const title = $(element).find("h3.imds-font-headline a").text().trim();
      let link = $(element).find("a").attr("href");

      if (link && !link.startsWith("http")) {
        link = `https://www.infomoney.com.br${link}`;
      }

      if (title && link) {
        guides.push({ title, link });
      }
    });

    for (let guide of guides) {
      await page.goto(guide.link, { waitUntil: "networkidle2" });
      const guideContent = await page.content();
      const $$ = cheerio.load(guideContent);

      $$("section").each((i, element) => {
        const sectionTitle = $$(element).find("h2").text().trim();
        if (
          sectionTitle === "Investir no Exterior" ||
          sectionTitle === "Macroeconomia"
        ) {
          $$(element).remove();
        }
      });

      let articleContent = "";
      $$("section.article-body p").each((i, element) => {
        articleContent += $$(element).text().trim() + "\n";
      });

      articleContent = articleContent.replace(
        /CONTINUA DEPOIS DA PUBLICIDADE/g,
        ""
      );

      guide.content = articleContent.trim();
    }

    await browser.close();

    const dataDir = path.join(process.cwd(), "src", "data");
    const filePath = path.join(dataDir, "infomoney_guia_investimentos.json");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(guides, null, 2), "utf-8");
    console.log(`Dados salvos em ${filePath}`);

    return guides;
  } catch (error) {
    console.error(`Erro ao fazer scraping:`, error);
    return [];
  }
};
