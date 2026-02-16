import { Link } from "react-router-dom";
import type { Product } from "../../data/products";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  // Знаходимо найменшу ціну (50g варіант)
  const minVariant =
    product.variants.find((v) => v.weight === "50g") || product.variants[0];
  const price = minVariant.price;

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block bg-background shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <div className="aspect-square overflow-hidden bg-background-variant">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-montserrat font-semibold text-sm text-primary line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <p className="font-montserrat text-lg font-bold text-primary">
            €{price.toFixed(2)}
            <span className="text-xs font-normal text-primary opacity-60">
              {" "}
              / {minVariant.weight}
            </span>
          </p>

          {product.organic && (
            <span className="text-xs font-montserrat uppercase bg-secondary text-secondary-on px-2 py-1">
              Organic
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
