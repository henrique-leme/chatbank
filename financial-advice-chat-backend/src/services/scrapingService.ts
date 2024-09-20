import { db } from "../config/firebase";

export const saveScrapedData = async (
  articles: { title: string; link: string; content?: string }[],
  collectionName: string
) => {
  const batch = db.batch();

  articles.forEach((article) => {
    const docRef = db.collection(collectionName).doc();
    batch.set(docRef, {
      title: article.title,
      link: article.link,
      content: article.content || "",
      scrapedAt: new Date(),
    });
  });

  await batch.commit();
  console.log(
    `Dados de scraping salvos na coleção ${collectionName} com sucesso.`
  );
};

export const getScrapedData = async (collectionName: string) => {
  try {
    const collectionRef = db.collection(collectionName);
    const snapshot = await collectionRef.get();

    if (snapshot.empty) {
      console.log(`Nenhum dado encontrado na coleção: ${collectionName}`);
      return [];
    }

    const scrapedData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return scrapedData;
  } catch (error) {
    console.error(`Erro ao obter dados da coleção ${collectionName}:`, error);
    throw new Error(`Erro ao obter dados da coleção ${collectionName}`);
  }
};
