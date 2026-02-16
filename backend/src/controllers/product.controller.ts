import { type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Адаптер (вже є)
const adaptProduct = (product: any) => {
  const minPrice =
    product.variants.length > 0
      ? Math.min(...product.variants.map((v: any) => Number(v.price)))
      : 0;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    origin:
      typeof product.origin === "object"
        ? [product.origin.country, product.origin.region].filter(Boolean)
        : product.origin || [],
    flavor: product.flavor || [],
    caffeine: product.caffeine,
    organic: product.organic,
    vegan: product.vegan,
    price: minPrice,
    image: product.imageUrl,
    description: product.description || "",
    allergens: Array.isArray(product.allergens) ? product.allergens : [],
    qualities: Array.isArray(product.qualities) ? product.qualities : [],
    ingredients: product.ingredients || "",
    brewing: {
      servingSize: product.brewingInfo?.amount || "2 tsp per cup",
      waterTemp: product.brewingInfo?.temperature || "100°C",
      steepingTime: product.brewingInfo?.time || "3-5 minutes",
      colorAfter3Min: "#8B4513",
    },
    variants: product.variants.map((v: any) => ({
      id: v.id,
      weight: v.weight,
      price: Number(v.price),
      stock: v.stock || 0,
    })),
  };
};

// getAllProducts, getProductById, getProductBySlug (вже є)
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        variants: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const adaptedProducts = products.map(adaptProduct);
    res.json(adaptedProducts);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Failed to get products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(adaptProduct(product));
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Failed to get product" });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        variants: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(adaptProduct(product));
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Failed to get product" });
  }
};

// ========== ADMIN METHODS ========== //

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      slug,
      description,
      category,
      origin,
      flavor,
      caffeine,
      organic,
      vegan,
      allergens,
      qualities,
      ingredients,
      imageUrl,
      brewingInfo,
      variants,
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        category,
        stock: 0,
        origin:
          Array.isArray(origin) && origin.length > 0
            ? { country: origin[0], region: origin[1] || "" }
            : { country: "Unknown", region: "" },
        flavor: Array.isArray(flavor) ? flavor : [],
        caffeine,
        organic,
        vegan,
        allergens: Array.isArray(allergens) ? allergens : [],
        qualities: Array.isArray(qualities) ? qualities : [],
        ingredients,
        imageUrl,
        brewingInfo: {
          amount: brewingInfo?.amount || "2 tsp per cup",
          temperature: brewingInfo?.temperature || "100°C",
          time: brewingInfo?.time || "3-5 minutes",
        },
        variants: {
          create: variants.map((v: any) => ({
            weight: v.weight,
            price: Number(v.price),
            stock: Number(v.stock),
          })),
        },
      },
      include: {
        variants: true,
      },
    });

    res.status(201).json(adaptProduct(product));
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      category,
      origin,
      flavor,
      caffeine,
      organic,
      vegan,
      allergens,
      qualities,
      ingredients,
      imageUrl,
      brewingInfo,
      variants,
    } = req.body;

    // Видаляємо старі варіанти
    await prisma.productVariant.deleteMany({
      where: { productId: id },
    });

    // Оновлюємо продукт з новими варіантами
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        category,
        origin:
          Array.isArray(origin) && origin.length > 0
            ? { country: origin[0], region: origin[1] || "" }
            : { country: "Unknown", region: "" },
        flavor: Array.isArray(flavor) ? flavor : [],
        caffeine,
        organic,
        vegan,
        allergens: Array.isArray(allergens) ? allergens : [],
        qualities: Array.isArray(qualities) ? qualities : [],
        ingredients,
        imageUrl,
        brewingInfo: {
          amount: brewingInfo?.amount || "2 tsp per cup",
          temperature: brewingInfo?.temperature || "100°C",
          time: brewingInfo?.time || "3-5 minutes",
        },
        variants: {
          create: variants.map((v: any) => ({
            weight: v.weight,
            price: Number(v.price),
            stock: Number(v.stock),
          })),
        },
      },
      include: {
        variants: true,
      },
    });

    res.json(adaptProduct(product));
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Спочатку видаляємо варіанти
    await prisma.productVariant.deleteMany({
      where: { productId: id },
    });

    // Потім видаляємо продукт
    await prisma.product.delete({
      where: { id },
    });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
