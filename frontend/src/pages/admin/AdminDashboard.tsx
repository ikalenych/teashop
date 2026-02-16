import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";

const TEST = 56;

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Завантажуємо замовлення
      const ordersData = await api.getAllOrders();
      const orders = ordersData.orders || ordersData;

      // Завантажуємо продукти
      const products = await api.getProducts();

      // Рахуємо статистику
      const totalOrders = orders.length;
      const totalProducts = products.length;
      const totalRevenue = orders.reduce(
        (sum: number, order: any) => sum + Number(order.total),
        0,
      );

      // Унікальні користувачі (по email)
      const uniqueEmails = new Set(orders.map((order: any) => order.email));
      const totalCustomers = uniqueEmails.size;

      setStats({
        totalOrders,
        totalProducts,
        totalRevenue,
        totalCustomers,
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-prosto text-4xl text-primary mb-2">
            Admin Dashboard
          </h1>
          <p className="font-montserrat text-sm text-primary opacity-60">
            Welcome back, {user?.name}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-background-variant p-6 border-l-4 border-primary">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-primary opacity-60" />
              <span className="font-montserrat text-3xl font-bold text-primary">
                {stats.totalOrders}
              </span>
            </div>
            <p className="font-montserrat text-sm text-primary opacity-80 uppercase">
              Total Orders
            </p>
          </div>

          <div className="bg-background-variant p-6 border-l-4 border-secondary">
            <div className="flex items-center justify-between mb-2">
              <ShoppingBag className="w-8 h-8 text-secondary opacity-60" />
              <span className="font-montserrat text-3xl font-bold text-primary">
                {stats.totalProducts}
              </span>
            </div>
            <p className="font-montserrat text-sm text-primary opacity-80 uppercase">
              Products
            </p>
          </div>

          <div className="bg-background-variant p-6 border-l-4 border-primary">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-primary opacity-60" />
              <span className="font-montserrat text-3xl font-bold text-primary">
                {stats.totalCustomers}
              </span>
            </div>
            <p className="font-montserrat text-sm text-primary opacity-80 uppercase">
              Customers
            </p>
          </div>

          <div className="bg-background-variant p-6 border-l-4 border-secondary">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-secondary opacity-60" />
              <span className="font-montserrat text-3xl font-bold text-primary">
                €{stats.totalRevenue.toFixed(2)}
              </span>
            </div>
            <p className="font-montserrat text-sm text-primary opacity-80 uppercase">
              Revenue
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 ">
          <Link
            to="/admin/orders"
            className="bg-background-variant p-8 hover:bg-primary hover:text-primary-on transition-colors group"
          >
            <Package className="w-12 h-12 mb-4 text-primary group-hover:text-primary-on" />
            <h3 className="font-prosto text-2xl mb-2">Manage Orders</h3>
            <p className="font-montserrat text-sm opacity-80">
              View and update order statuses
            </p>
          </Link>

          <Link
            to="/admin/products"
            className="bg-background-variant p-8 hover:bg-primary hover:text-primary-on transition-colors group"
          >
            <ShoppingBag className="w-12 h-12 mb-4 text-primary group-hover:text-primary-on" />
            <h3 className="font-prosto text-2xl mb-2">Manage Products</h3>
            <p className="font-montserrat text-sm opacity-80">
              Add, edit or remove products
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};
