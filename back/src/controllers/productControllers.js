import createProductServices from "../services/productServices.js";

export default function ProductControllers(prisma) {
  const service = createProductServices(prisma);

  return {
    getAll: async (req, res) => {
      const products = await service.list();
      res.json(products);
    },

    getById: async (req, res) => {
      const id = Number(req.params.id);
      const product = await service.findById(id);
      if (!product) return res.status(404).json({ error: "Produto não encontrado" });
      res.json(product);
    },

    create: async (req, res) => {
      // exige imagem
      if (!req.file) {
        return res.status(400).json({ error: "Imagem é obrigatória." });
      }
      const data = req.body;
      data.imageUrl = `/uploads/${req.file.filename}`;
      const newProduct = await service.create(data);
      res.status(201).json(newProduct);
    },

    update: async (req, res) => {
      // exige nova imagem
      if (!req.file) {
        return res.status(400).json({ error: "Imagem é obrigatória." });
      }
      const id = Number(req.params.id);
      const data = req.body;
      data.imageUrl = `/uploads/${req.file.filename}`;
      const updated = await service.update(id, data);
      res.json(updated);
    },

    remove: async (req, res) => {
      const id = Number(req.params.id);
      await service.remove(id);
      res.json({ message: "Produto removido com sucesso" });
    }
  };
}
