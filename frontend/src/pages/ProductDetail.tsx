import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../lib/api";
import type { Product } from "../data/products";
import { useCart } from "../context/CartContext";
import { Globe, Leaf, ShoppingBag, Minus, Plus } from "lucide-react";

export const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (slug) {
      loadProduct(slug);
      loadRelatedProducts();
    }
  }, [slug]);

  const loadProduct = async (slug: string) => {
    try {
      setLoading(true);
      const data = await api.getProductBySlug(slug);
      setProduct(data);
    } catch (error) {
      console.error("Failed to load product:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedProducts = async () => {
    try {
      const allProducts = await api.getProducts();
      setRelatedProducts(allProducts);
    } catch (error) {
      console.error("Failed to load related products:", error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const variant = product.variants[selectedVariant];

    addToCart(
      {
        productId: product.id,
        variantId: variant.id,
        productName: product.name,
        productSlug: product.slug,
        productImage: product.image,
        variantIndex: selectedVariant,
        variantWeight: variant.weight,
        price: variant.price,
      },
      quantity,
    );

    setQuantity(1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="font-montserrat text-primary">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-prosto text-3xl text-primary mb-4">
          Product not found
        </h1>
        <Link to="/collections" className="text-secondary hover:underline">
          Back to collections
        </Link>
      </div>
    );
  }

  const currentVariant = product.variants[selectedVariant];
  const related = relatedProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <div className="bg-background min-h-screen py-8">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 mb-6">
        <p className="font-montserrat text-sm text-primary uppercase">
          <Link to="/" className="hover:text-secondary">
            Home
          </Link>
          {" / "}
          <Link to="/collections" className="hover:text-secondary">
            Collections
          </Link>
          {" / "}
          <Link
            to={`/collections?category=${product.category}`}
            className="hover:text-secondary"
          >
            {product.category}
          </Link>
          {" / "}
          <span className="opacity-60">{product.name}</span>
        </p>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Left: Image */}
          <div>
            <div className="aspect-square bg-background-variant rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Info */}
          <div className="space-y-6">
            <div>
              <h1 className="font-prosto text-4xl text-primary mb-3">
                {product.name}
              </h1>
              <p className="font-montserrat text-primary leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 font-montserrat text-sm text-primary">
                <Globe className="w-4 h-4" />
                Origin: {product.origin.join(", ")}
              </div>

              {product.organic && (
                <span className="bg-secondary text-secondary-on px-3 py-1 text-xs font-montserrat uppercase">
                  Organic
                </span>
              )}

              {product.vegan && (
                <div className="flex items-center gap-2 font-montserrat text-sm text-primary">
                  <Leaf className="w-4 h-4" />
                  Vegan
                </div>
              )}
            </div>

            {/* Price */}
            <div className="border-t border-outline pt-6">
              <p className="font-montserrat text-4xl font-bold text-primary">
                €{currentVariant.price.toFixed(2)}
              </p>
            </div>

            {/* Variants */}
            <div>
              <h3 className="font-montserrat font-semibold text-sm uppercase mb-3 text-primary">
                Variants
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {product.variants.map((variant, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedVariant(index)}
                    className={`
                      border-2 p-3 transition-all
                      ${
                        selectedVariant === index
                          ? "border-primary bg-primary text-primary-on"
                          : "border-outline hover:border-primary"
                      }
                    `}
                  >
                    <div className="text-center">
                      <ShoppingBag className="w-6 h-6 mx-auto mb-1" />
                      <p className="font-montserrat text-xs font-semibold">
                        {variant.weight === "sampler"
                          ? "Sampler"
                          : variant.weight}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to Bag */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 border-outline">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-background-variant transition-colors"
                >
                  <Minus className="w-4 h-4 text-primary" />
                </button>
                <span className="px-6 font-montserrat font-semibold text-primary">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-background-variant transition-colors"
                >
                  <Plus className="w-4 h-4 text-primary" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-primary-on py-4 px-8 font-montserrat font-medium uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Bag
              </button>
            </div>
          </div>
        </div>

        {/* Bottom: Details */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Steeping Instructions */}
          <div className="bg-background-variant p-8">
            <h2 className="font-prosto text-2xl text-primary mb-6">
              Steeping instructions
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 flex-shrink-0 mt-1">
                  <svg
                    viewBox="0 0 24 24"
                    className="text-primary"
                    fill="currentColor"
                  >
                    <path d="M2,21V19H20V21H2M20,8V5H18V8H20M20,3A2,2 0 0,1 22,5V8A2,2 0 0,1 20,10H18V13A4,4 0 0,1 14,17H8A4,4 0 0,1 4,13V3H20M16,5H6V13A2,2 0 0,0 8,15H14A2,2 0 0,0 16,13V5Z" />
                  </svg>
                </div>
                <div>
                  <p className="font-montserrat font-semibold text-sm text-primary uppercase mb-1">
                    Serving Size:
                  </p>
                  <p className="font-montserrat text-sm text-primary">
                    {product.brewing.servingSize}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 flex-shrink-0 mt-1">
                  <svg
                    viewBox="0 0 24 24"
                    className="text-primary"
                    fill="currentColor"
                  >
                    <path d="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 12,22A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z" />
                  </svg>
                </div>
                <div>
                  <p className="font-montserrat font-semibold text-sm text-primary uppercase mb-1">
                    Water Temperature:
                  </p>
                  <p className="font-montserrat text-sm text-primary">
                    {product.brewing.waterTemp}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 flex-shrink-0 mt-1">
                  <svg
                    viewBox="0 0 24 24"
                    className="text-primary"
                    fill="currentColor"
                  >
                    <path d="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.2,16.5L16,15.2L12.5,13.2V8Z" />
                  </svg>
                </div>
                <div>
                  <p className="font-montserrat font-semibold text-sm text-primary uppercase mb-1">
                    Steeping Time:
                  </p>
                  <p className="font-montserrat text-sm text-primary">
                    {product.brewing.steepingTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex-shrink-0 mt-1 border border-outline"
                  style={{ backgroundColor: product.brewing.colorAfter3Min }}
                />
                <div>
                  <p className="font-montserrat font-semibold text-sm text-primary uppercase mb-1">
                    Color after 3 minutes
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* About this tea */}
          <div className="bg-background-variant p-8">
            <h2 className="font-prosto text-2xl text-primary mb-6">
              About this tea
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="font-montserrat font-semibold text-xs uppercase mb-2 text-primary">
                  Flavor
                </p>
                <p className="font-montserrat text-sm text-primary capitalize">
                  {product.flavor.join(", ")}
                </p>
              </div>

              <div>
                <p className="font-montserrat font-semibold text-xs uppercase mb-2 text-primary">
                  Qualities
                </p>
                <p className="font-montserrat text-sm text-primary capitalize">
                  {product.qualities.join(", ")}
                </p>
              </div>

              <div>
                <p className="font-montserrat font-semibold text-xs uppercase mb-2 text-primary">
                  Caffeine
                </p>
                <p className="font-montserrat text-sm text-primary capitalize">
                  {product.caffeine}
                </p>
              </div>

              <div>
                <p className="font-montserrat font-semibold text-xs uppercase mb-2 text-primary">
                  Allergens
                </p>
                <p className="font-montserrat text-sm text-primary capitalize">
                  {product.allergens.join(", ").replace(/-/g, " ")}
                </p>
              </div>
            </div>

            <div>
              <p className="font-montserrat font-semibold text-xs uppercase mb-2 text-primary">
                Ingredient
              </p>
              <p className="font-montserrat text-sm text-primary leading-relaxed">
                {product.ingredients}
              </p>
            </div>
          </div>
        </div>

        {/* You may also like */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-prosto text-3xl text-center mb-12 text-primary">
              You may also like
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {related.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.slug}`}
                  className="group block bg-background shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="aspect-square overflow-hidden bg-background-variant">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-montserrat font-semibold text-sm text-primary mb-2">
                      {relatedProduct.name}
                    </h3>
                    <p className="font-montserrat text-lg font-bold text-primary">
                      €{relatedProduct.price.toFixed(2)}
                      <span className="text-xs font-normal opacity-60">
                        {" "}
                        / {relatedProduct.variants[0].weight}
                      </span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
