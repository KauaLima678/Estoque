// src/services/categoryServices.js
export default function categoryServices(prisma) {
  return {
    // retorna todas as categorias
    list: () => prisma.category.findMany(),

    // retorna uma categoria pelo ID
    findById: (id) =>
      prisma.category.findUnique({
        where: { id: Number(id) },
      }),

    // cria uma nova categoria
    create: ({ name, description }) =>
      prisma.category.create({
        data: { name, description },
      }),

    // atualiza uma categoria existente
    update: (id, { name, description }) =>
      prisma.category.update({
        where: { id: Number(id) },
        data: { name, description },
      }),

    // deleta uma categoria
    remove: (id) =>
      prisma.category.delete({
        where: { id: Number(id) },
      }),
  };
}
