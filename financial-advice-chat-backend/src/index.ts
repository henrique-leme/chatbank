import express, { Request, Response } from "express";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";
import scrapingRoutes from "./routes/scrapingRoutes";
import http from "http";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors());

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Rotas da aplicação
app.use("/users", userRoutes);
app.use("/chat", chatRoutes);
app.use("/scraping", scrapingRoutes);

// Rota 404 para endpoints não encontrados
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Endpoint não encontrado",
    path: req.path,
    method: req.method,
  });
});

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.setTimeout(300000);

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
