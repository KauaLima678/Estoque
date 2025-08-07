// src/controllers/categoryControllers.js
import categoryServices from "../services/categoryServices.js";
export default function CategoryControllers(prisma) {
  const service = categoryServices(prisma);

  return {
    // GET /categorias
    getAll: async (req, res) => {
      try {
        const categories = await service.list();
        res.json(categories);
      } catch (err) {
        res.status(500).json({ error: "Erro ao listar categorias", detail: err.message });
      }
    },

    // GET /categorias/:id
    getById: async (req, res) => {
      const id = Number(req.params.id);
      try {
        const category = await service.findById(id);
        if (!category) {
          return res.status(404).json({ error: "Categoria não encontrada" });
        }
        res.json(category);
      } catch (err) {
        res.status(500).json({ error: "Erro ao buscar categoria", detail: err.message });
      }
    },

    // POST /categorias
    create: async (req, res) => {
      try {
        const data = req.body;
        const newCategory = await service.create(data);
        res.status(201).json(newCategory);
      } catch (err) {
        res.status(400).json({ error: "Erro ao criar categoria", detail: err.message });
      }
    },

    // PUT /categorias/:id
    // PATCH /categorias/:id
    update: async (req, res) => {
      const id = Number(req.params.id);
      try {
        const data = req.body;
        const updated = await service.update(id, data);
        res.json(updated);
      } catch (err) {
        res.status(400).json({ error: "Erro ao atualizar categoria", detail: err.message });
      }
    },

    // DELETE /categorias/:id
    remove: async (req, res) => {
      const id = Number(req.params.id);
      try {
        await service.remove(id);
        res.status(204).send();
      } catch (err) {
        res.status(400).json({ error: "Erro ao excluir categoria", detail: err.message });
      }
    },
  };
}
