import { Search, User, ShoppingBag } from "lucide-react";
import { BrandIcon } from "../icons/BrandIcon";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export const Header = () => {
  const { totalItems, openSidebar } = useCart();
  const navigate = useNavigate();
  {
    /* Для того аби не дуплювати класи */
  }
  const navLinkClass =
    "font-montserrat text-xs uppercase tracking-wider text-primary hover:text-secondary transition-colors";

  return (
    <header className="bg-background shadow sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Лого */}
          <div className="flex items-center gap-2">
            <BrandIcon size={28} className="text-primary" />
            <Link to="/" className="font-prosto text-lg text-primary">
              Chai Nasvai
            </Link>
          </div>

          {/* Навігація - десктоп */}
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

          {/* Іконки */}
          <div className="flex items-center gap-6">
            <button className="text-primary hover:text-secondary transition-colors">
              <Search size={18} />
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
