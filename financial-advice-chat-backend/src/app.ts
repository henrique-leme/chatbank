import express, { Application } from "express";
import routes from "./routes";

const app: Application = express();

// app.use(cors());
app.use(express.json());
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("API está funcionando!");
});

export default app;
