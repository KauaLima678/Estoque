import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app    = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

app.use("/produtos",   productRoutes(prisma));
app.use("/categorias", categoryRoutes(prisma));

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
