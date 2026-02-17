import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware, verifyAdmin } from "../middleware/auth.middleware";

jest.mock("jsonwebtoken");

describe("Auth Middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    process.env.JWT_SECRET = "test-secret";
  });

  describe("authMiddleware", () => {
    it("should return 401 if no token provided", () => {
      authMiddleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "No token provided" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 if token does not start with Bearer", () => {
      req.headers = { authorization: "InvalidToken" };

      authMiddleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "No token provided" });
    });

    it("should return 401 if token is invalid", () => {
      req.headers = { authorization: "Bearer invalid-token" };
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      authMiddleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
    });

    it("should call next() and set userId and userRole if token is valid", () => {
      const mockDecoded = { userId: "user123", role: "USER" };
      req.headers = { authorization: "Bearer valid-token" };
      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      authMiddleware(req as Request, res as Response, next);

      expect((req as any).userId).toBe("user123");
      expect((req as any).userRole).toBe("USER");
      expect(next).toHaveBeenCalled();
    });
  });

  describe("verifyAdmin", () => {
    it("should return 403 if user is not admin", () => {
      (req as any).userRole = "USER";

      verifyAdmin(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Access denied. Admin only.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next() if user is admin", () => {
      (req as any).userRole = "ADMIN";

      verifyAdmin(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
