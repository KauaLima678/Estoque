// src/routes/categoryRoutes.js
import { Router } from "express";
import CategoryControllers from "../controllers/categoryControllers.js";

export default function categoryRoutes(prisma) {
  const controllers = CategoryControllers(prisma);
  const router = Router();

  router.get("/",       controllers.getAll);
  router.get("/:id",    controllers.getById);
  router.post("/",      controllers.create);
  router.put("/:id",    controllers.update);
  router.patch("/:id",  controllers.update);
  router.delete("/:id", controllers.remove);

  return router;
}
