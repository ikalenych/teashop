import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import type { Product } from "../data/products";
import {
  getUniqueValues,
  filterProducts,
  sortProducts,
} from "../utils/filterHelpers";
import { ProductCard } from "../components/products/ProductCard";
import { FilterSection } from "../components/products/FilterSection";

export const Collections = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper для отримання масиву з URL
  const getArrayParam = (key: string): string[] => {
    const value = searchParams.get(key);
    return value ? value.split(",") : [];
  };

  // Читаємо параметри з URL
  const categories = getArrayParam("category");
  const origins = getArrayParam("origin");
  const flavors = getArrayParam("flavor");
  const caffeines = getArrayParam("caffeine");
  const organic = searchParams.get("organic") === "true";
  const sort = searchParams.get("sort") || "";

  // Динамічно витягуємо всі можливі значення
  const allCategories = getUniqueValues(products, "category");
  const allOrigins = getUniqueValues(products, "origin");
  const allFlavors = getUniqueValues(products, "flavor");
  const allCaffeineOptions = ["none", "low", "medium", "high"];

  // Фільтруємо та сортуємо
  const filteredProducts = filterProducts(products, {
    categories: categories.length > 0 ? categories : undefined,
    origins: origins.length > 0 ? origins : undefined,
    flavors: flavors.length > 0 ? flavors : undefined,
    caffeines: caffeines.length > 0 ? caffeines : undefined,
    organic: organic || undefined,
  });

  const sortedProducts = sortProducts(filteredProducts, sort);

  // Функція для зміни фільтра
  const handleFilterChange = (key: string, values: string[]) => {
    const newParams = new URLSearchParams(searchParams);

    if (values.length > 0) {
      newParams.set(key, values.join(","));
    } else {
      newParams.delete(key);
    }

    setSearchParams(newParams);
  };

  // Скидання фільтрів
  const handleClearFilters = () => {
    setSearchParams({ sort });
  };

  // Зміна сортування
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value) {
      newParams.set("sort", e.target.value);
    } else {
      newParams.delete("sort");
    }
    setSearchParams(newParams);
  };

  // Чи є активні фільтри
  const hasActiveFilters =
    categories.length > 0 ||
    origins.length > 0 ||
    flavors.length > 0 ||
    caffeines.length > 0 ||
    organic;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-montserrat text-primary">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-8">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 mb-6">
        <p className="font-montserrat text-sm text-primary">
          HOME/COLLECTIONS
          {categories.length === 1 && `/${categories[0].toUpperCase()}`}
        </p>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar з фільтрами */}
          <aside className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-prosto text-xl text-primary">Collections</h3>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-secondary hover:underline font-montserrat uppercase"
                >
                  Clear all
                </button>
              )}
            </div>

            <FilterSection
              title="Collections"
              options={allCategories}
              selectedValues={categories}
              onChange={(values) => handleFilterChange("category", values)}
              defaultOpen={true}
            />

            <FilterSection
              title="Origin"
              options={allOrigins}
              selectedValues={origins}
              onChange={(values) => handleFilterChange("origin", values)}
              defaultOpen={false}
            />

            <FilterSection
              title="Flavor"
              options={allFlavors}
              selectedValues={flavors}
              onChange={(values) => handleFilterChange("flavor", values)}
              defaultOpen={false}
            />

            <FilterSection
              title="Caffeine"
              options={allCaffeineOptions}
              selectedValues={caffeines}
              onChange={(values) => handleFilterChange("caffeine", values)}
              defaultOpen={false}
            />

            {/* Organic toggle */}
            <div className="border-b border-outline pb-4">
              <label className="flex items-center gap-2 cursor-pointer hover:bg-background-variant px-2 py-1 rounded transition-colors">
                <input
                  type="checkbox"
                  checked={organic}
                  onChange={(e) => {
                    const newParams = new URLSearchParams(searchParams);
                    if (e.target.checked) {
                      newParams.set("organic", "true");
                    } else {
                      newParams.delete("organic");
                    }
                    setSearchParams(newParams);
                  }}
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
                <span className="font-montserrat text-sm font-semibold text-primary uppercase">
                  Organic
                </span>
              </label>
            </div>
          </aside>

          {/* Товари */}
          <div className="md:col-span-3">
            {/* Sort dropdown */}
            <div className="flex justify-between items-center mb-6">
              <p className="font-montserrat text-sm text-primary">
                <span className="font-semibold">{sortedProducts.length}</span>{" "}
                products found
              </p>

              <select
                value={sort}
                onChange={handleSortChange}
                className="font-montserrat text-sm border border-outline px-4 py-2 bg-background text-primary rounded cursor-pointer"
              >
                <option value="">Sort by</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
              </select>
            </div>

            {/* Active filters badges */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-2 bg-primary text-primary-on px-3 py-1 text-xs font-montserrat uppercase"
                  >
                    {cat}
                    <button
                      onClick={() =>
                        handleFilterChange(
                          "category",
                          categories.filter((c) => c !== cat),
                        )
                      }
                      className="hover:text-secondary"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {origins.map((orig) => (
                  <span
                    key={orig}
                    className="inline-flex items-center gap-2 bg-primary text-primary-on px-3 py-1 text-xs font-montserrat uppercase"
                  >
                    {orig}
                    <button
                      onClick={() =>
                        handleFilterChange(
                          "origin",
                          origins.filter((o) => o !== orig),
                        )
                      }
                      className="hover:text-secondary"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Grid товарів */}
            <div className="grid md:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Якщо нічого не знайдено */}
            {sortedProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="font-montserrat text-primary text-lg mb-2">
                  No products found
                </p>
                <p className="font-montserrat text-sm text-primary opacity-60 mb-4">
                  Try adjusting your filters
                </p>
                <button
                  onClick={handleClearFilters}
                  className="font-montserrat text-sm text-secondary hover:underline uppercase"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
