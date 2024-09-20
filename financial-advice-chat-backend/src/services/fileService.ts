import * as fs from "fs";
import * as path from "path";

export const saveDatasetToFile = (data: any, filename: string) => {
  try {
    const dataDir = path.join(process.cwd(), "src", "datasets");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`Dataset ${filename} salvo com sucesso.`);
  } catch (error) {
    console.error(
      `Erro ao salvar dataset ${filename}: ${(error as Error).message}`
    );
  }
};
