import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import { CheckCircle, Package } from "lucide-react";

export const ThankYou = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      // ← ЗМІНИВ ТУТ: використовуємо getOrderById
      const data = await api.getOrderById(orderId!);
      setOrder(data);
    } catch (error) {
      console.error("Failed to load order:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-montserrat text-primary">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Package className="w-16 h-16 text-primary opacity-20 mx-auto mb-4" />
          <h1 className="font-prosto text-3xl text-primary mb-4">
            Order not found
          </h1>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-primary text-primary-on font-montserrat uppercase hover:opacity-90"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Header */}
        <div className="text-center mb-12">
          <CheckCircle className="w-20 h-20 text-secondary mx-auto mb-6" />
          <h1 className="font-prosto text-4xl text-primary mb-4">
            Thank You for Your Order!
          </h1>
          <p className="font-montserrat text-primary opacity-80">
            Your order has been confirmed and will be shipped soon.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-background-variant p-8 mb-6">
          <div className="flex justify-between items-start mb-6 pb-6 border-b border-outline">
            <div>
              <p className="font-montserrat text-sm uppercase text-primary opacity-60 mb-1">
                Order Number
              </p>
              <p className="font-montserrat text-xl font-bold text-primary">
                {order.orderNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="font-montserrat text-sm uppercase text-primary opacity-60 mb-1">
                Order Date
              </p>
              <p className="font-montserrat text-primary">
                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Order Status */}
          <div className="mb-6 pb-6 border-b border-outline">
            <p className="font-montserrat text-sm uppercase text-primary opacity-60 mb-2">
              Status
            </p>
            <span className="inline-block px-4 py-2 bg-primary text-primary-on font-montserrat text-sm uppercase">
              {order.status}
            </span>
          </div>

          {/* Shipping Address */}
          <div className="mb-6 pb-6 border-b border-outline">
            <p className="font-montserrat text-sm uppercase text-primary opacity-60 mb-3">
              Shipping Address
            </p>
            <div className="font-montserrat text-primary">
              <p className="font-semibold">
                {order.shippingFirstName} {order.shippingLastName}
              </p>
              <p>{order.shippingStreet}</p>
              <p>
                {order.shippingPostCode}, {order.shippingCity}
              </p>
              <p>{order.shippingCountry}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <p className="font-montserrat text-sm uppercase text-primary opacity-60 mb-4">
              Order Items
            </p>
            <div className="space-y-4">
              {order.items?.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 pb-4 border-b border-outline last:border-0"
                >
                  <img
                    src={item.product?.imageUrl || "https://placehold.co/80x80"}
                    alt={item.product?.name}
                    className="w-20 h-20 object-cover bg-outline"
                  />
                  <div className="flex-1">
                    <h3 className="font-montserrat font-semibold text-primary mb-1">
                      {item.product?.name}
                    </h3>
                    <p className="font-montserrat text-sm text-primary opacity-60">
                      {item.variant?.weight} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-montserrat font-bold text-primary">
                      €{(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="pt-6 border-t border-outline">
            <div className="flex justify-between font-montserrat text-primary mb-2">
              <span>Subtotal</span>
              <span>€{(Number(order.total) - 3.95).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-montserrat text-primary mb-4">
              <span>Delivery</span>
              <span>€3.95</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-outline">
              <span className="font-montserrat font-semibold text-primary text-lg">
                Total
              </span>
              <span className="font-montserrat text-2xl font-bold text-primary">
                €{Number(order.total).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="px-8 py-4 border-2 border-primary text-primary font-montserrat uppercase hover:bg-primary hover:text-primary-on transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            to="/account"
            className="px-8 py-4 bg-primary text-primary-on font-montserrat uppercase hover:opacity-90 transition-opacity"
          >
            View My Orders
          </Link>
        </div>

        {/* Confirmation Email Note */}
        <div className="text-center mt-8">
          <p className="font-montserrat text-sm text-primary opacity-60">
            A confirmation email has been sent to{" "}
            <span className="font-semibold">{order.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
