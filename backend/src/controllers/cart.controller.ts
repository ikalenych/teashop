import { type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
        variant: true,
      },
    });

    res.json(cartItems);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ error: "Failed to get cart" });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { productId, variantId, quantity } = req.body;

    // Перевіряємо чи існує товар
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId_variantId: {
          userId,
          productId,
          variantId,
        },
      },
    });

    let cartItem;

    if (existingItem) {
      // Оновлюємо кількість
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
        include: {
          product: true,
          variant: true,
        },
      });
    } else {
      // Додаємо новий товар
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          variantId,
          quantity,
        },
        include: {
          product: true,
          variant: true,
        },
      });
    }

    res.status(201).json(cartItem);
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { quantity } = req.body;

    // Перевіряємо що айтем належить користувачу
    const cartItem = await prisma.cartItem.findFirst({
      where: { id, userId },
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    const updated = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: {
        product: true,
        variant: true,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ error: "Failed to update cart" });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    // Перевіряємо що айтем належить користувачу
    const cartItem = await prisma.cartItem.findFirst({
      where: { id, userId },
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    await prisma.cartItem.delete({
      where: { id },
    });

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ error: "Failed to remove from cart" });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
};
