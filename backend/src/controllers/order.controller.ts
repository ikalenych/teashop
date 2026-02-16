import { type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${timestamp}-${random}`;
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const {
      shippingFirstName,
      shippingLastName,
      shippingStreet,
      shippingPostCode,
      shippingCity,
      shippingCountry,
      billingSameAsShipping,
      billingFirstName,
      billingLastName,
      billingStreet,
      billingPostCode,
      billingCity,
      billingCountry,
      email,
      paymentType,
      items,
    } = req.body;

    const variantIds = items.map((item: any) => item.variantId);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: true },
    });

    let subtotal = 0;
    const orderItems = items.map((item: any) => {
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant) throw new Error(`Variant ${item.variantId} not found`);

      const itemTotal = Number(variant.price) * item.quantity;
      subtotal += itemTotal;

      return {
        productId: variant.productId,
        variantId: variant.id,
        productName: variant.product.name,
        variantWeight: variant.weight,
        price: variant.price,
        quantity: item.quantity,
      };
    });

    const deliveryCost = 5.99;
    const total = subtotal + deliveryCost;

    const order = await prisma.order.create({
      data: {
        userId,
        orderNumber: generateOrderNumber(),
        shippingFirstName,
        shippingLastName,
        shippingStreet,
        shippingPostCode,
        shippingCity,
        shippingCountry,
        billingSameAsShipping,
        billingFirstName: billingSameAsShipping
          ? shippingFirstName
          : billingFirstName,
        billingLastName: billingSameAsShipping
          ? shippingLastName
          : billingLastName,
        billingStreet: billingSameAsShipping ? shippingStreet : billingStreet,
        billingPostCode: billingSameAsShipping
          ? shippingPostCode
          : billingPostCode,
        billingCity: billingSameAsShipping ? shippingCity : billingCity,
        billingCountry: billingSameAsShipping
          ? shippingCountry
          : billingCountry,
        email,
        subtotal,
        deliveryCost,
        total,
        paymentType,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ error: "Failed to get orders" });
  }
};
// Отримати ВСІ замовлення (для адміна)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    const where = status ? { status: status as any } : {};

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: Number(limit),
      skip: Number(offset),
    });

    const total = await prisma.order.count({ where });

    res.json({ orders, total });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ error: "Failed to get orders" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        user: {
          select: { id: true, email: true, name: true, role: true }, // ← ДОДАЙ role
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Перевіряємо права доступу
    const requestingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    // ← ПЕРЕВІРКА: або твоє замовлення, або ти адмін
    if (order.userId !== userId && requestingUser?.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ error: "Failed to get order" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: true,
      },
    });

    res.json(order);
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
};
