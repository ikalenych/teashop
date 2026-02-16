import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import type { Product } from "../../data/products"; // ← ВИКОРИСТОВУЄМО ТВІЙ ТИП
import { ChevronLeft, Plus, Edit2, Trash2, Package } from "lucide-react";

export const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;

    try {
      await api.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async () => {
    await loadProducts();
    handleCloseForm();
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="p-2 hover:bg-background-variant transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-primary" />
            </Link>
            <div>
              <h1 className="font-prosto text-4xl text-primary mb-2">
                Products Management
              </h1>
              <p className="font-montserrat text-sm text-primary opacity-60">
                {products.length} total products
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-on font-montserrat uppercase hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="font-montserrat text-primary">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-primary opacity-20 mx-auto mb-4" />
            <p className="font-montserrat text-primary opacity-60 mb-6">
              No products found
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-primary text-primary-on font-montserrat uppercase hover:opacity-90"
            >
              Add First Product
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-background-variant overflow-hidden group"
              >
                {/* Image */}
                <div className="aspect-square bg-outline overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-montserrat font-semibold text-primary mb-1 truncate">
                    {product.name}
                  </h3>
                  <p className="font-montserrat text-xs text-primary opacity-60 uppercase mb-2">
                    {product.category}
                  </p>
                  <p className="font-montserrat text-lg font-bold text-primary mb-3">
                    €{product.price.toFixed(2)}
                  </p>

                  {/* Variants */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.variants.slice(0, 3).map((variant, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-montserrat px-2 py-1 bg-outline"
                      >
                        {variant.weight}
                      </span>
                    ))}
                    {product.variants.length > 3 && (
                      <span className="text-xs font-montserrat px-2 py-1 bg-outline">
                        +{product.variants.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-on transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="font-montserrat text-xs uppercase">
                        Edit
                      </span>
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary text-primary-on hover:opacity-80 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="font-montserrat text-xs uppercase">
                        Delete
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <ProductFormModal
          product={editingProduct}
          onClose={handleCloseForm}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};

// ============================================
// Product Form Modal Component
// ============================================

interface ProductFormModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: () => void;
}

const ProductFormModal = ({
  product,
  onClose,
  onSave,
}: ProductFormModalProps) => {
  const isEditing = !!product;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    category: product?.category || "black-tea",
    description: product?.description || "",
    imageUrl: product?.image || "",
    organic: product?.organic || false,
    vegan: product?.vegan || false,
    caffeine: product?.caffeine || "medium",
    origin: Array.isArray(product?.origin) ? product.origin : [],
    flavor: Array.isArray(product?.flavor) ? product.flavor : [],
    allergens: Array.isArray(product?.allergens) ? product.allergens : [],
    qualities: Array.isArray(product?.qualities) ? product.qualities : [],
    ingredients: product?.ingredients || "",
    brewingInfo: {
      amount: product?.brewing?.servingSize || "2 tsp per cup",
      temperature: product?.brewing?.waterTemp || "100°C",
      time: product?.brewing?.steepingTime || "3-5 minutes",
    },
    variants: product?.variants?.map((v) => ({
      weight: v.weight,
      price: v.price,
      stock: v.stock,
    })) ?? [{ weight: "50g", price: 0, stock: 0 }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        slug: formData.slug,
        category: formData.category,
        description: formData.description,
        imageUrl: formData.imageUrl,
        organic: formData.organic,
        vegan: formData.vegan,
        caffeine: formData.caffeine,
        origin: formData.origin.length > 0 ? formData.origin : ["Unknown"],
        flavor: formData.flavor,
        allergens: formData.allergens,
        qualities: formData.qualities,
        ingredients: formData.ingredients,
        stock: 0,
        brewingInfo: formData.brewingInfo,
        variants: formData.variants.map((v) => ({
          weight: v.weight,
          price: Number(v.price),
          stock: Number(v.stock),
        })),
      };

      if (isEditing && product) {
        await api.updateProduct(product.id, productData);
      } else {
        await api.createProduct(productData);
      }

      onSave();
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { weight: "100g", price: 0, stock: 0 }],
    });
  };

  const removeVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    });
  };

  const updateVariant = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-background max-w-4xl w-full my-8">
        <div className="bg-primary text-primary-on p-6 flex justify-between items-center">
          <h2 className="font-prosto text-2xl">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl hover:opacity-80 transition-opacity"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 max-h-[70vh] overflow-y-auto"
        >
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block font-montserrat text-sm uppercase mb-2 text-primary">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border border-outline px-4 py-3 font-montserrat text-sm bg-background focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-montserrat text-sm uppercase mb-2 text-primary">
                Slug (URL) *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="w-full border border-outline px-4 py-3 font-montserrat text-sm bg-background focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-montserrat text-sm uppercase mb-2 text-primary">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full border border-outline px-4 py-3 font-montserrat text-sm bg-background focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="black-tea">Black Tea</option>
                <option value="green-tea">Green Tea</option>
                <option value="white-tea">White Tea</option>
                <option value="oolong">Oolong</option>
                <option value="matcha">Matcha</option>
                <option value="chai">Chai</option>
                <option value="herbal-tea">Herbal Tea</option>
                <option value="rooibos">Rooibos</option>
                <option value="teaware">Teaware</option>
              </select>
            </div>

            <div>
              <label className="block font-montserrat text-sm uppercase mb-2 text-primary">
                Caffeine Level
              </label>
              <select
                value={formData.caffeine}
                onChange={(e) =>
                  setFormData({ ...formData, caffeine: e.target.value })
                }
                className="w-full border border-outline px-4 py-3 font-montserrat text-sm bg-background focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div className="mb-6">
            <label className="block font-montserrat text-sm uppercase mb-2 text-primary">
              Image URL *
            </label>
            <input
              type="url"
              required
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              placeholder="https://images.unsplash.com/..."
              className="w-full border border-outline px-4 py-3 font-montserrat text-sm bg-background focus:outline-none focus:border-primary"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block font-montserrat text-sm uppercase mb-2 text-primary">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full border border-outline px-4 py-3 font-montserrat text-sm bg-background focus:outline-none focus:border-primary"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.organic}
                onChange={(e) =>
                  setFormData({ ...formData, organic: e.target.checked })
                }
                className="w-4 h-4 accent-primary cursor-pointer"
              />
              <span className="font-montserrat text-sm text-primary">
                Organic
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.vegan}
                onChange={(e) =>
                  setFormData({ ...formData, vegan: e.target.checked })
                }
                className="w-4 h-4 accent-primary cursor-pointer"
              />
              <span className="font-montserrat text-sm text-primary">
                Vegan
              </span>
            </label>
          </div>

          {/* Ingredients */}
          <div className="mb-6">
            <label className="block font-montserrat text-sm uppercase mb-2 text-primary">
              Ingredients
            </label>
            <input
              type="text"
              value={formData.ingredients}
              onChange={(e) =>
                setFormData({ ...formData, ingredients: e.target.value })
              }
              placeholder="Green tea leaves, jasmine flowers"
              className="w-full border border-outline px-4 py-3 font-montserrat text-sm bg-background focus:outline-none focus:border-primary"
            />
          </div>

          {/* Variants */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="font-montserrat text-sm uppercase text-primary">
                Variants *
              </label>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-on font-montserrat text-xs uppercase hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                Add Variant
              </button>
            </div>

            <div className="space-y-3">
              {formData.variants.map((variant, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <input
                    type="text"
                    placeholder="Weight (50g)"
                    value={variant.weight}
                    onChange={(e) =>
                      updateVariant(index, "weight", e.target.value)
                    }
                    required
                    className="flex-1 border border-outline px-4 py-2 font-montserrat text-sm bg-background focus:outline-none focus:border-primary"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    step="0.01"
                    value={variant.price}
                    onChange={(e) =>
                      updateVariant(index, "price", e.target.value)
                    }
                    required
                    className="w-32 border border-outline px-4 py-2 font-montserrat text-sm bg-background focus:outline-none focus:border-primary"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={variant.stock}
                    onChange={(e) =>
                      updateVariant(index, "stock", e.target.value)
                    }
                    required
                    className="w-32 border border-outline px-4 py-2 font-montserrat text-sm bg-background focus:outline-none focus:border-primary"
                  />
                  {formData.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="p-2 hover:bg-primary hover:text-primary-on transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end pt-6 border-t border-outline">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-outline font-montserrat uppercase hover:border-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-primary-on font-montserrat uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : isEditing
                  ? "Update Product"
                  : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
