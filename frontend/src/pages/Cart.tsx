import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Minus, Plus } from "lucide-react";

const DELIVERY_COST = 3.95;

export const Cart = () => {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="bg-background min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-prosto text-3xl text-primary mb-4">
            Your bag is empty
          </h1>
          <p className="font-montserrat text-primary mb-8">
            Add some tea to get started!
          </p>
          <Link
            to="/collections"
            className="inline-block bg-primary text-primary-on px-8 py-3 font-montserrat font-medium uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Browse Collections
          </Link>
        </div>
      </div>
    );
  }

  const total = subtotal + DELIVERY_COST;

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Steps */}
        <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-on flex items-center justify-center font-montserrat font-bold">
                1
              </div>
              <span className="font-montserrat font-semibold text-primary uppercase text-sm">
                My Bag
              </span>
            </div>
            <div className="h-1 bg-primary mt-2"></div>
          </div>

          <div className="flex-1 ml-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-outline text-primary flex items-center justify-center font-montserrat">
                2
              </div>
              <span className="font-montserrat text-primary opacity-40 uppercase text-sm">
                Delivery
              </span>
            </div>
            <div className="h-1 bg-outline mt-2"></div>
          </div>

          <div className="flex-1 ml-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-outline text-primary flex items-center justify-center font-montserrat">
                3
              </div>
              <span className="font-montserrat text-primary opacity-40 uppercase text-sm">
                Review & Payment
              </span>
            </div>
            <div className="h-1 bg-outline mt-2"></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantIndex}`}
                data-testid="cart-item"
                className="bg-background-variant p-6 flex gap-4"
              >
                {/* Image */}
                <Link
                  to={`/product/${item.productSlug}`}
                  className="flex-shrink-0"
                >
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-24 h-24 object-cover"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1">
                  <Link to={`/product/${item.productSlug}`}>
                    <h3 className="font-montserrat font-semibold text-primary hover:text-secondary transition-colors">
                      {item.productName}
                    </h3>
                  </Link>
                  <p className="font-montserrat text-sm text-primary opacity-60 mt-1">
                    {item.variantWeight}
                  </p>

                  <button
                    onClick={() =>
                      removeFromCart(item.productId, item.variantIndex)
                    }
                    className="font-montserrat text-sm text-secondary hover:underline mt-2 uppercase"
                  >
                    Remove
                  </button>
                </div>

                {/* Quantity */}
                <div className="flex items-center border-2 border-outline h-fit">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.variantIndex,
                        item.quantity - 1,
                      )
                    }
                    className="p-2 hover:bg-background transition-colors"
                  >
                    <Minus className="w-4 h-4 text-primary" />
                  </button>
                  <span className="px-4 font-montserrat font-semibold text-primary">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.variantIndex,
                        item.quantity + 1,
                      )
                    }
                    className="p-2 hover:bg-background transition-colors"
                  >
                    <Plus className="w-4 h-4 text-primary" />
                  </button>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="font-montserrat font-bold text-lg text-primary">
                    €{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}

            {/* Back to shopping */}
            <Link
              to="/collections"
              className="inline-block border-2 border-primary text-primary px-8 py-3 font-montserrat font-medium uppercase tracking-wider hover:bg-primary hover:text-primary-on transition-all mt-4"
            >
              Back to Shopping
            </Link>
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-6">
            <div className="bg-background-variant p-6">
              <h2 className="font-prosto text-2xl text-primary mb-6">
                Order summery
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between font-montserrat text-sm">
                  <span className="text-primary">Subtotal</span>
                  <span className="font-semibold text-primary">
                    €{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-montserrat text-sm">
                  <span className="text-primary">Delivery</span>
                  <span className="font-semibold text-primary">
                    €{DELIVERY_COST.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-t border-outline pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-montserrat font-semibold text-primary">
                    Total
                  </span>
                  <span className="font-montserrat text-2xl font-bold text-primary">
                    €{total.toFixed(2)}
                  </span>
                </div>
                <p className="font-montserrat text-xs text-primary opacity-60 mt-2">
                  Estimated shipping time: 2 days
                </p>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-primary text-primary-on py-4 font-montserrat font-medium uppercase tracking-wider hover:opacity-90 transition-opacity block text-center"
              >
                Check Out
              </Link>
            </div>

            {/* Payment icons */}
            <div className="bg-background-variant p-6">
              <h3 className="font-montserrat font-semibold text-sm uppercase mb-4 text-primary">
                Payment type
              </h3>
              <div className="flex gap-3 flex-wrap">
                <div className="w-12 h-8 bg-background flex items-center justify-center">
                  <span className="text-xs font-bold">VISA</span>
                </div>
                <div className="w-12 h-8 bg-background flex items-center justify-center">
                  <span className="text-xs font-bold">MC</span>
                </div>
                <div className="w-12 h-8 bg-background flex items-center justify-center">
                  <span className="text-xs font-bold">iD</span>
                </div>
              </div>
            </div>

            {/* Delivery info */}
            <div className="bg-background-variant p-6">
              <h3 className="font-montserrat font-semibold text-sm uppercase mb-4 text-primary">
                Delivery and retour
              </h3>
              <ul className="space-y-3 text-sm font-montserrat text-primary">
                <li className="flex items-start gap-2">
                  <span className="text-secondary">→</span>
                  Order before 12:00 and we will ship the same day.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary">→</span>
                  Orders made after Friday 12:00 are processed on Monday.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary">→</span>
                  To return your articles, please contact us first.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary">→</span>
                  Postal charges for retour are not reimbursed.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
