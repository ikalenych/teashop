import { Sun, Moon, User, ShoppingBag } from "lucide-react";
import { BrandIcon } from "../icons/BrandIcon";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useEffect, useState } from "react";

export const Header = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const dark = savedTheme === "dark";

    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const { totalItems, openSidebar } = useCart();
  const navigate = useNavigate();

  const navLinkClass =
    "font-montserrat text-xs uppercase tracking-wider text-primary hover:text-secondary transition-colors";

  return (
    <header className="bg-background shadow sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <BrandIcon size={28} className="text-primary" />
            <Link to="/" className="font-prosto text-lg text-primary">
              Chai Town
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/collections" className={navLinkClass}>
              Tea Collections
            </Link>
            <Link to="/accessories" className={navLinkClass}>
              Accessories
            </Link>
            <Link to="/contact" className={navLinkClass}>
              Contact Us
            </Link>
          </nav>

          <div className="flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className="text-primary hover:text-secondary transition-colors"
            >
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button
              onClick={() => navigate("/account")}
              className="text-primary hover:text-secondary transition-colors"
            >
              <User size={18} />
            </button>

            <button
              onClick={openSidebar}
              className="text-primary hover:text-secondary transition-colors relative"
            >
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-secondary text-secondary-on rounded-full flex items-center justify-center text-xs font-montserrat font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
