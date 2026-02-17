import {
  getUniqueValues,
  filterProducts,
  sortProducts,
} from "../utils/filterHelpers";

describe("filterHelpers", () => {
  const mockProducts = [
    {
      id: "1",
      name: "Green Tea",
      price: 100,
      category: "Green",
      origin: ["China", "Japan"],
      flavor: ["Fresh", "Grassy"],
      caffeine: "Medium",
      organic: true,
    },
    {
      id: "2",
      name: "Black Tea",
      price: 150,
      category: "Black",
      origin: ["India"],
      flavor: ["Bold", "Malty"],
      caffeine: "High",
      organic: false,
    },
    {
      id: "3",
      name: "White Tea",
      price: 200,
      category: "White",
      origin: ["China"],
      flavor: ["Delicate", "Sweet"],
      caffeine: "Low",
      organic: true,
    },
    {
      id: "4",
      name: "Oolong Tea",
      price: 120,
      category: "Oolong",
      origin: ["Taiwan", "China"],
      flavor: ["Floral", "Fruity"],
      caffeine: "Medium",
      organic: false,
    },
  ];

  describe("getUniqueValues", () => {
    it("should return unique origins sorted alphabetically", () => {
      const result = getUniqueValues(mockProducts, "origin");
      expect(result).toEqual(["China", "India", "Japan", "Taiwan"]);
    });

    it("should return unique flavors sorted alphabetically", () => {
      const result = getUniqueValues(mockProducts, "flavor");
      expect(result).toEqual([
        "Bold",
        "Delicate",
        "Floral",
        "Fresh",
        "Fruity",
        "Grassy",
        "Malty",
        "Sweet",
      ]);
    });

    it("should return unique categories sorted alphabetically", () => {
      const result = getUniqueValues(mockProducts, "category");
      expect(result).toEqual(["Black", "Green", "Oolong", "White"]);
    });
  });

  describe("filterProducts", () => {
    it("should filter products by category", () => {
      const filters = { categories: ["Green", "White"] };
      const result = filterProducts(mockProducts, filters);
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.name)).toEqual(["Green Tea", "White Tea"]);
    });

    it("should filter products by origin", () => {
      const filters = { origins: ["India"] };
      const result = filterProducts(mockProducts, filters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Black Tea");
    });

    it("should filter products by flavor", () => {
      const filters = { flavors: ["Sweet"] };
      const result = filterProducts(mockProducts, filters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("White Tea");
    });

    it("should filter products by caffeine level", () => {
      const filters = { caffeines: ["Medium"] };
      const result = filterProducts(mockProducts, filters);
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.name)).toEqual(["Green Tea", "Oolong Tea"]);
    });

    it("should filter organic products only", () => {
      const filters = { organic: true };
      const result = filterProducts(mockProducts, filters);
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.name)).toEqual(["Green Tea", "White Tea"]);
    });

    it("should apply multiple filters simultaneously", () => {
      const filters = {
        categories: ["Green", "White"],
        organic: true,
      };
      const result = filterProducts(mockProducts, filters);
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.name)).toEqual(["Green Tea", "White Tea"]);
    });

    it("should return all products when no filters applied", () => {
      const filters = {};
      const result = filterProducts(mockProducts, filters);
      expect(result).toHaveLength(4);
    });
  });

  describe("sortProducts", () => {
    it("should sort products by price ascending", () => {
      const result = sortProducts(mockProducts, "price-asc");
      expect(result.map((p) => p.price)).toEqual([100, 120, 150, 200]);
    });

    it("should sort products by price descending", () => {
      const result = sortProducts(mockProducts, "price-desc");
      expect(result.map((p) => p.price)).toEqual([200, 150, 120, 100]);
    });

    it("should sort products by name ascending", () => {
      const result = sortProducts(mockProducts, "name-asc");
      expect(result.map((p) => p.name)).toEqual([
        "Black Tea",
        "Green Tea",
        "Oolong Tea",
        "White Tea",
      ]);
    });

    it("should sort products by name descending", () => {
      const result = sortProducts(mockProducts, "name-desc");
      expect(result.map((p) => p.name)).toEqual([
        "White Tea",
        "Oolong Tea",
        "Green Tea",
        "Black Tea",
      ]);
    });

    it("should return products unsorted for unknown sortBy value", () => {
      const result = sortProducts(mockProducts, "unknown");
      expect(result).toHaveLength(4);
      expect(result[0].name).toBe("Green Tea");
    });

    it("should not mutate original array", () => {
      const original = [...mockProducts];
      sortProducts(mockProducts, "price-asc");
      expect(mockProducts).toEqual(original);
    });
  });
});
