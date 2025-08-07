import { Router } from "express";
import multer from "multer";
import path from "path";
import ProductControllers from "../controllers/productControllers.js";

export default function productRoutes(prisma) {
  const router = Router();
  const controller = ProductControllers(prisma);

  // Configuração do multer
  const upload = multer({
    storage: multer.diskStorage({
      destination: "./uploads/",
      filename: (_, file, cb) =>
        cb(null, `${Date.now()}${path.extname(file.originalname)}`),
    }),
    fileFilter: (_, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const allowed = [".png", ".jpg", ".jpeg", ".webp"];
      if (!allowed.includes(ext)) {
        return cb(
          new Error(`Só são permitidas imagens (${allowed.join(", ")})`)
        );
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // opcional: limite 5MB
  });

  router.get("/", controller.getAll);
  router.get("/:id", controller.getById);
  router.post("/", upload.single("image"), controller.create);
  router.patch("/:id", upload.single("image"), controller.update);
  router.delete("/:id", controller.remove);

  return router;
}
