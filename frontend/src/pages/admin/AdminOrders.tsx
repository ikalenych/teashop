import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { ChevronLeft, Package } from "lucide-react";

export const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getAllOrders(filter || undefined);
      setOrders(data.orders || data); // Backend може повертати {orders, total} або просто масив
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      // Оновлюємо локально
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update order status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-outline text-primary";
      case "PAID":
        return "bg-primary text-primary-on";
      case "PACKING":
        return "bg-outline text-primary";
      case "SHIPPED":
        return "bg-secondary text-secondary-on";
      case "DELIVERED":
        return "bg-secondary text-secondary-on";
      case "CANCELLED":
        return "bg-primary text-primary-on opacity-50";
      default:
        return "bg-outline text-primary";
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/admin"
            className="p-2 hover:bg-background-variant transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </Link>
          <div className="flex-1">
            <h1 className="font-prosto text-4xl text-primary mb-2">
              Orders Management
            </h1>
            <p className="font-montserrat text-sm text-primary opacity-60">
              {orders.length} total orders
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-background-variant p-4 mb-6 flex gap-3 overflow-x-auto">
          <button
            onClick={() => setFilter("")}
            className={`px-4 py-2 font-montserrat text-sm uppercase whitespace-nowrap transition-colors ${
              filter === ""
                ? "bg-primary text-primary-on"
                : "border border-outline hover:border-primary"
            }`}
          >
            All
          </button>
          {[
            "PENDING",
            "PAID",
            "PACKING",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 font-montserrat text-sm uppercase whitespace-nowrap transition-colors ${
                filter === status
                  ? "bg-primary text-primary-on"
                  : "border border-outline hover:border-primary"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="font-montserrat text-primary">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-primary opacity-20 mx-auto mb-4" />
            <p className="font-montserrat text-primary opacity-60">
              No orders found
            </p>
          </div>
        ) : (
          <div className="bg-background-variant overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline">
                  <th className="text-left p-4 font-montserrat text-sm uppercase text-primary">
                    Order #
                  </th>
                  <th className="text-left p-4 font-montserrat text-sm uppercase text-primary">
                    Customer
                  </th>
                  <th className="text-left p-4 font-montserrat text-sm uppercase text-primary">
                    Date
                  </th>
                  <th className="text-left p-4 font-montserrat text-sm uppercase text-primary">
                    Items
                  </th>
                  <th className="text-left p-4 font-montserrat text-sm uppercase text-primary">
                    Total
                  </th>
                  <th className="text-left p-4 font-montserrat text-sm uppercase text-primary">
                    Status
                  </th>
                  <th className="text-left p-4 font-montserrat text-sm uppercase text-primary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-outline hover:bg-background transition-colors"
                  >
                    <td className="p-4">
                      <Link
                        to={`/thank-you/${order.id}`}
                        className="font-montserrat font-semibold text-primary hover:text-secondary"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="p-4">
                      <div className="font-montserrat text-sm text-primary">
                        <p className="font-semibold">
                          {order.shippingFirstName} {order.shippingLastName}
                        </p>
                        <p className="text-xs opacity-60">{order.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-montserrat text-sm text-primary">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-montserrat text-sm text-primary">
                        {order.items?.length || 0} items
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-montserrat font-bold text-primary">
                        €{Number(order.total).toFixed(2)}
                      </p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs font-montserrat uppercase ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="border border-outline px-3 py-2 font-montserrat text-sm bg-background focus:outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PAID">Paid</option>
                        <option value="PACKING">Packing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
