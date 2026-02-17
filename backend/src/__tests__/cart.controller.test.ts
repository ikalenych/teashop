import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  addToCart,
  updateCartItem,
  removeFromCart,
} from "../controllers/cart.controller";

// Mock Prisma
jest.mock("@prisma/client", () => {
  const mockPrisma = {
    cartItem: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const prisma = new PrismaClient();
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});
describe("Cart Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("addToCart", () => {
    it("should add new item to cart if not exists", async () => {
      (req as any).userId = "user123";
      req.body = { productId: "prod1", variantId: "var1", quantity: 2 };

      const mockCartItem = {
        id: "cart1",
        userId: "user123",
        productId: "prod1",
        variantId: "var1",
        quantity: 2,
        product: { id: "prod1", name: "Green Tea" },
        variant: { id: "var1", weight: "100g" },
      };

      (prisma.cartItem.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.cartItem.create as jest.Mock).mockResolvedValue(mockCartItem);

      await addToCart(req as Request, res as Response);

      expect(prisma.cartItem.findUnique).toHaveBeenCalled();
      expect(prisma.cartItem.create).toHaveBeenCalledWith({
        data: {
          userId: "user123",
          productId: "prod1",
          variantId: "var1",
          quantity: 2,
        },
        include: {
          product: true,
          variant: true,
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCartItem);
    });

    it("should update quantity if item already exists", async () => {
      (req as any).userId = "user123";
      req.body = { productId: "prod1", variantId: "var1", quantity: 2 };

      const existingItem = {
        id: "cart1",
        userId: "user123",
        productId: "prod1",
        variantId: "var1",
        quantity: 3,
      };

      const updatedItem = { ...existingItem, quantity: 5 };

      (prisma.cartItem.findUnique as jest.Mock).mockResolvedValue(existingItem);
      (prisma.cartItem.update as jest.Mock).mockResolvedValue(updatedItem);

      await addToCart(req as Request, res as Response);

      expect(prisma.cartItem.update).toHaveBeenCalledWith({
        where: { id: "cart1" },
        data: { quantity: 5 },
        include: {
          product: true,
          variant: true,
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(updatedItem);
    });

    it("should return 500 on error", async () => {
      (req as any).userId = "user123";
      req.body = { productId: "prod1", variantId: "var1", quantity: 2 };

      (prisma.cartItem.findUnique as jest.Mock).mockRejectedValue(
        new Error("DB Error"),
      );

      await addToCart(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to add to cart" });
    });
  });

  describe("updateCartItem", () => {
    it("should update cart item quantity", async () => {
      (req as any).userId = "user123";
      req.params = { id: "cart1" };
      req.body = { quantity: 5 };

      const cartItem = { id: "cart1", userId: "user123", quantity: 3 };
      const updatedItem = { ...cartItem, quantity: 5 };

      (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue(cartItem);
      (prisma.cartItem.update as jest.Mock).mockResolvedValue(updatedItem);

      await updateCartItem(req as Request, res as Response);

      expect(prisma.cartItem.update).toHaveBeenCalledWith({
        where: { id: "cart1" },
        data: { quantity: 5 },
        include: {
          product: true,
          variant: true,
        },
      });
      expect(res.json).toHaveBeenCalledWith(updatedItem);
    });

    it("should return 404 if cart item not found", async () => {
      (req as any).userId = "user123";
      req.params = { id: "cart1" };
      req.body = { quantity: 5 };

      (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue(null);

      await updateCartItem(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Cart item not found" });
    });
  });

  describe("removeFromCart", () => {
    it("should remove item from cart", async () => {
      (req as any).userId = "user123";
      req.params = { id: "cart1" };

      const cartItem = { id: "cart1", userId: "user123" };

      (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue(cartItem);
      (prisma.cartItem.delete as jest.Mock).mockResolvedValue(cartItem);

      await removeFromCart(req as Request, res as Response);

      expect(prisma.cartItem.delete).toHaveBeenCalledWith({
        where: { id: "cart1" },
      });
      expect(res.json).toHaveBeenCalledWith({
        message: "Item removed from cart",
      });
    });

    it("should return 404 if cart item not found", async () => {
      (req as any).userId = "user123";
      req.params = { id: "cart1" };

      (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue(null);

      await removeFromCart(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Cart item not found" });
    });
  });
});
