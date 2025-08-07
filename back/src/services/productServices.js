export default function createProductServices(prisma) {
  return {
    list: () =>
      prisma.product.findMany({
        include: { category: true }
      }),

    findById: (id) =>
      prisma.product.findUnique({
        where: { id: Number(id) },
        include: { category: true }
      }),

    create: (data) =>
      prisma.product.create({
        data: {
          name:        data.name,
          description: data.description,
          price:       Number(data.price),
          quantity:    Number(data.quantity),
          imageUrl:    data.imageUrl,
          categoryId:  data.categoryId ? Number(data.categoryId) : null
        }
      }),

    update: (id, data) =>
      prisma.product.update({
        where: { id: Number(id) },
        data: {
          name:        data.name,
          description: data.description,
          price:       Number(data.price),
          quantity:    Number(data.quantity),
          imageUrl:    data.imageUrl,
          categoryId:  data.categoryId ? Number(data.categoryId) : null
        }
      }),

    remove: (id) =>
      prisma.product.delete({ where: { id: Number(id) } })
  };
}
