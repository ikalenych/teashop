import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { User as UserIcon, Package, LogOut, ChevronRight } from "lucide-react";

export const UserProfile = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await api.getUserOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  // Статус кольори та labels
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-secondary text-secondary-on";
      case "SHIPPED":
        return "bg-primary text-primary-on";
      case "PACKING":
        return "bg-outline text-primary";
      case "PAID":
        return "bg-outline text-primary";
      case "PENDING":
        return "bg-outline text-primary opacity-60";
      case "CANCELLED":
        return "bg-primary text-primary-on opacity-50";
      default:
        return "bg-outline text-primary";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase().replace("_", " ");
  };

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header з аватаром */}
        <div className="bg-background-variant p-8 mb-8">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-outline flex items-center justify-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-12 h-12 text-primary opacity-40" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="font-prosto text-3xl text-primary mb-1">
                {user.name}
              </h1>
              <p className="font-montserrat text-sm text-primary opacity-60">
                {user.email}
              </p>
            </div>

            {/* Logout button */}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-primary-on transition-all font-montserrat text-sm uppercase tracking-wider"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Orders section */}
        <div className="bg-background-variant p-8">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-primary" />
            <h2 className="font-prosto text-2xl text-primary">My Orders</h2>
          </div>

          {loading ? (
            <p className="font-montserrat text-sm text-primary opacity-60 text-center py-8">
              Loading orders...
            </p>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-primary opacity-20 mx-auto mb-4" />
              <p className="font-montserrat text-sm text-primary opacity-60 mb-6">
                You haven't placed any orders yet
              </p>
              <Link
                to="/collections"
                className="inline-block px-6 py-3 bg-primary text-primary-on font-montserrat font-medium uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  to={`/thank-you/${order.id}`}
                  className="block bg-background border border-outline p-6 hover:border-primary transition-colors group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-montserrat font-semibold text-primary mb-1">
                        Order {order.orderNumber}
                      </p>
                      <p className="font-montserrat text-sm text-primary opacity-60">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-montserrat uppercase ${getStatusStyle(order.status)}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="font-montserrat text-sm text-primary">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </p>
                    <div className="flex items-center gap-3">
                      <p className="font-montserrat font-bold text-lg text-primary">
                        €{Number(order.total).toFixed(2)}
                      </p>
                      <ChevronRight className="w-5 h-5 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
