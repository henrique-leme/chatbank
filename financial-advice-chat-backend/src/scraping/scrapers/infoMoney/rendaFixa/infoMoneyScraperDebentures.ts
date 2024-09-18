import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

export const scrapeInfomoneyDebentures = async () => {
  const url = "https://www.infomoney.com.br/tudo-sobre/debentures/";

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const content = await page.content();
    const $ = cheerio.load(content);

    const articles: {
      title: string;
      link: string;
      time?: string;
      content?: string;
    }[] = [];

    $("article.article-card").each((i, element) => {
      const title = $(element).find("h3.article-card__headline").text().trim();
      let link = $(element).find("a.article-card__headline-link").attr("href");
      const time = $(element).find("time").text().trim();

      if (link && !link.startsWith("http")) {
        link = `https://www.infomoney.com.br${link}`;
      }

      if (title && link) {
        articles.push({ title, link, time });
      }
    });

    const articleContents = [];

    for (let article of articles) {
      await page.goto(article.link, { waitUntil: "networkidle2" });

      const articlePageContent = await page.content();
      const article$ = cheerio.load(articlePageContent);

      let articleText = article$("article.im-article").text().trim();

      articleText = articleText
        .replace(/^Publicidade\s*/, "")
        .replace(/\s{2,}/g, " ")
        .replace(/Guia gratuito da Rico.*pouco/, "");

      articleContents.push({ ...article, content: articleText });
    }

    await browser.close();

    const dataDir = path.join(process.cwd(), "src", "data");
    const filePath = path.join(dataDir, "infomoney_debentures.json");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(
      filePath,
      JSON.stringify(articleContents, null, 2),
      "utf-8"
    );
    console.log(`Dados salvos em ${filePath}`);

    return articleContents;
  } catch (error) {
    console.error(`Erro ao fazer scraping:`, error);
    return [];
  }
};
