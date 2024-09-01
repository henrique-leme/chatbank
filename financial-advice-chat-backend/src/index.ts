import express from "express";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";

const app = express();

app.use(express.json());

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
