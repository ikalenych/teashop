import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Показуємо loader поки завантажується
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-montserrat text-primary">Loading...</p>
        </div>
      </div>
    );
  }

  // Якщо не залогінений → на логін
  if (!isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  // Якщо не адмін → на головну
  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // Якщо адмін → показуємо контент
  return <>{children}</>;
};
