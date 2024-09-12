import express from "express";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";
import scrapingRoutes from "./routes/scrapingRoutes";
import http from "http";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors());

app.use("/users", userRoutes);
app.use("/chat", chatRoutes);
app.use("/scraping", scrapingRoutes);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.setTimeout(300000);

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
