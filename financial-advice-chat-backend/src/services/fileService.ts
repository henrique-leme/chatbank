import * as fs from "fs";
import * as path from "path";

export const saveDatasetToFile = (data: any[], filename: string) => {
  try {
    const dataDir = path.join(process.cwd(), "src", "datasets");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const filePath = path.join(dataDir, filename);

    let existingData: any[] = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      existingData = JSON.parse(fileContent);
    }

    const filteredData = data.filter((newArticle) => {
      const isDuplicate = existingData.some(
        (existingArticle) => existingArticle.title === newArticle.title
      );
      if (isDuplicate) {
        console.log(
          `Artigo com o título "${newArticle.title}" já existe no arquivo. Ignorando...`
        );
      }
      return !isDuplicate;
    });

    if (filteredData.length > 0) {
      const updatedData = [...existingData, ...filteredData];
      fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), "utf-8");
      console.log(`Dataset ${filename} atualizado com sucesso.`);
    } else {
      console.log(`Nenhum novo artigo para adicionar ao dataset ${filename}.`);
    }
  } catch (error) {
    console.error(
      `Erro ao salvar dataset ${filename}: ${(error as Error).message}`
    );
  }
};
