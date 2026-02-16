import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { X, Minus, Plus } from "lucide-react";

const DELIVERY_COST = 3.95;

export const CartSidebar = () => {
  const {
    items,
    isSidebarOpen,
    closeSidebar,
    updateQuantity,
    removeFromCart,
    subtotal,
  } = useCart();

  const total = subtotal + DELIVERY_COST;

  // Блокуємо скрол коли сайдбар відкритий
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  return (
    <>
      {/* Backdrop - ПІДНЯЛИ z-index вище Header */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[60] transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - ще вище за backdrop */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full md:w-[400px] bg-background z-[70]
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
          shadow-2xl flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline">
          <h2 className="font-prosto text-2xl text-primary">My Bag</h2>
          <button
            onClick={closeSidebar}
            className="text-primary hover:text-secondary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <p className="font-montserrat text-primary text-center">
              Your bag is empty
            </p>
          </div>
        ) : (
          <>
            {/* Items List (scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantIndex}`}
                  className="flex gap-4 pb-4 border-b border-outline last:border-b-0"
                >
                  {/* Image */}
                  <Link
                    to={`/product/${item.productSlug}`}
                    onClick={closeSidebar}
                    className="flex-shrink-0"
                  >
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-20 h-20 object-cover"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.productSlug}`}
                      onClick={closeSidebar}
                    >
                      <h3 className="font-montserrat font-semibold text-sm text-primary hover:text-secondary transition-colors line-clamp-2">
                        {item.productName}
                      </h3>
                    </Link>
                    <p className="font-montserrat text-xs text-primary opacity-60 mt-1">
                      {item.variantWeight}
                    </p>

                    <button
                      onClick={() =>
                        removeFromCart(item.productId, item.variantIndex)
                      }
                      className="font-montserrat text-xs text-secondary hover:underline mt-2 uppercase"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex flex-col items-end gap-2">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-outline">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.variantIndex,
                            item.quantity - 1,
                          )
                        }
                        className="p-1 hover:bg-background-variant transition-colors"
                      >
                        <Minus className="w-3 h-3 text-primary" />
                      </button>
                      <span className="px-2 font-montserrat text-sm font-semibold text-primary min-w-[24px] text-center">
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
                        className="p-1 hover:bg-background-variant transition-colors"
                      >
                        <Plus className="w-3 h-3 text-primary" />
                      </button>
                    </div>

                    {/* Price */}
                    <p className="font-montserrat font-bold text-primary">
                      €{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer (Summary + Button) */}
            <div className="border-t border-outline p-6 space-y-4 bg-background-variant">
              {/* Subtotal */}
              <div className="flex justify-between font-montserrat text-sm">
                <span className="text-primary">Subtotal</span>
                <span className="font-semibold text-primary">
                  €{subtotal.toFixed(2)}
                </span>
              </div>

              {/* Delivery */}
              <div className="flex justify-between font-montserrat text-sm">
                <span className="text-primary">Delivery</span>
                <span className="font-semibold text-primary">
                  €{DELIVERY_COST.toFixed(2)}
                </span>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t border-outline">
                <span className="font-montserrat font-semibold text-primary">
                  Total
                </span>
                <span className="font-montserrat text-2xl font-bold text-primary">
                  €{total.toFixed(2)}
                </span>
              </div>

              {/* Purchase Button */}
              <Link
                to="/cart"
                onClick={closeSidebar}
                className="block w-full bg-primary text-primary-on py-4 text-center font-montserrat font-medium uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Purchase
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};
