// src/pages/Checkout.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const DELIVERY_COST = 3.95;

export const Checkout = () => {
  const { items, subtotal } = useCart();
  const navigate = useNavigate();

  // Якщо корзина пуста - редирект
  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  // Delivery form state
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    street: "",
    postCode: "",
    city: "",
    country: "Ukraine",
  });

  const [billingAddress, setBillingAddress] = useState({
    sameAsShipping: true,
    firstName: "",
    lastName: "",
    street: "",
    postCode: "",
    city: "",
    country: "Ukraine",
  });

  const [contactInfo, setContactInfo] = useState({
    email: "",
  });

  const total = subtotal + DELIVERY_COST;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Валідація форми

    // Переходимо на payment
    navigate("/payment", {
      state: {
        shippingAddress,
        billingAddress: billingAddress.sameAsShipping
          ? shippingAddress
          : billingAddress,
        contactInfo,
      },
    });
  };

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Steps */}
        <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
          {/* Step 1 - Completed */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary text-secondary-on flex items-center justify-center font-montserrat font-bold">
                ✓
              </div>
              <span className="font-montserrat font-semibold text-primary uppercase text-sm">
                My Bag
              </span>
            </div>
            <div className="h-1 bg-secondary mt-2"></div>
          </div>

          {/* Step 2 - Active */}
          <div className="flex-1 ml-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-on flex items-center justify-center font-montserrat font-bold">
                2
              </div>
              <span className="font-montserrat font-semibold text-primary uppercase text-sm">
                Delivery
              </span>
            </div>
            <div className="h-1 bg-primary mt-2"></div>
          </div>

          {/* Step 3 - Inactive */}
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

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Address */}
              <div>
                <h2 className="font-prosto text-2xl text-primary mb-6">
                  Shipping Address
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    required
                    value={shippingAddress.firstName}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        firstName: e.target.value,
                      })
                    }
                    className="border border-outline px-4 py-3 font-montserrat text-sm text-primary focus:outline-none focus:border-primary bg-background"
                  />

                  <input
                    type="text"
                    placeholder="Last Name"
                    required
                    value={shippingAddress.lastName}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        lastName: e.target.value,
                      })
                    }
                    className="border border-outline px-4 py-3 font-montserrat text-sm text-primary focus:outline-none focus:border-primary bg-background"
                  />

                  <input
                    type="text"
                    placeholder="Street and house number"
                    required
                    value={shippingAddress.street}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        street: e.target.value,
                      })
                    }
                    className="md:col-span-2 border border-outline px-4 py-3 font-montserrat text-sm text-primary focus:outline-none focus:border-primary bg-background"
                  />

                  <input
                    type="text"
                    placeholder="PostCode"
                    required
                    value={shippingAddress.postCode}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        postCode: e.target.value,
                      })
                    }
                    className="border border-outline px-4 py-3 font-montserrat text-sm text-primary focus:outline-none focus:border-primary bg-background"
                  />

                  <input
                    type="text"
                    placeholder="City"
                    required
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        city: e.target.value,
                      })
                    }
                    className="border border-outline px-4 py-3 font-montserrat text-sm text-primary focus:outline-none focus:border-primary bg-background"
                  />

                  <select
                    value={shippingAddress.country}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        country: e.target.value,
                      })
                    }
                    className="md:col-span-2 border border-outline px-4 py-3 font-montserrat text-sm text-primary focus:outline-none focus:border-primary bg-background cursor-pointer"
                  >
                    <option value="Ukraine">Ukraine</option>
                    <option value="Poland">Poland</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="USA">USA</option>
                  </select>
                </div>
              </div>

              {/* Billing Address */}
              <div>
                <h2 className="font-prosto text-2xl text-primary mb-4">
                  Billing Address
                </h2>

                <label className="flex items-center gap-2 mb-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={billingAddress.sameAsShipping}
                    onChange={(e) =>
                      setBillingAddress({
                        ...billingAddress,
                        sameAsShipping: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-primary cursor-pointer"
                  />
                  <span className="font-montserrat text-sm text-primary opacity-60">
                    Same as shipping address
                  </span>
                </label>

                {!billingAddress.sameAsShipping && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      required
                      value={billingAddress.firstName}
                      onChange={(e) =>
                        setBillingAddress({
                          ...billingAddress,
                          firstName: e.target.value,
                        })
                      }
                      className="border border-outline px-4 py-3 font-montserrat text-sm text-primary focus:outline-none focus:border-primary bg-background"
                    />

                    <input
                      type="text"
                      placeholder="Last Name"
                      required
                      value={billingAddress.lastName}
                      onChange={(e) =>
                        setBillingAddress({
                          ...billingAddress,
                          lastName: e.target.value,
                        })
                      }
                      className="border border-outline px-4 py-3 font-montserrat text-sm text-primary focus:outline-none focus:border-primary bg-background"
                    />

                    <input
                      type="text"
                      placeholder="Street and house number"
                      required
                      value={billingAddress.street}
                      onChange={(e) =>
                        setBillingAddress({
                          ...billingAddress,
                          street: e.target.value,
                        })
                      }
                      className="md:col-span-2 border border-outline px-4 py-3 font-montserrat text-sm text-primary focus:outline-none focus:border-primary bg-background"
                    />

                    <input
                      type="text"
                      placeholder="PostCode"
                      required
                      value={billingAddress.postCode}
                      onChange={(e) =>
                        setBillingAddress({
                          ...billingAddress,
                          postCode: e.target.value,
                        })
                      }
                      className="border border-outline px-4 py-3 font-montserrat text-sm text-primary focus:outline-none focus:border-primary bg-background"
                    />

                    <input
                      type="text"
                      placeholder="City"
                      required
                      value={billingAddress.city}
                      onChange={(e) =>
                        setBillingAddress({
                          ...billingAddress,
                          city: e.target.value,
                        })
                      }
                      className="border border-outline px-4 py-3 font-montserrat text-sm text-primary focus:outline-none focus:border-primary bg-background"
                    />

                    <select
                      value={billingAddress.country}
                      onChange={(e) =>
                        setBillingAddress({
                          ...billingAddress,
                          country: e.target.value,
                        })
                      }
                      className="md:col-span-2 border border-outline px-4 py-3 font-montserrat text-sm text-primary focus:outline-none focus:border-primary bg-background cursor-pointer"
                    >
                      <option value="Ukraine">Ukraine</option>
                      <option value="Poland">Poland</option>
                      <option value="Germany">Germany</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="font-prosto text-2xl text-primary mb-6">
                  Contact information
                </h2>

                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ email: e.target.value })}
                  className="w-full border border-outline px-4 py-3 font-montserrat text-sm text-primary focus:outline-none focus:border-primary bg-background"
                />
              </div>
            </div>

            {/* Right: Order Summary */}
            <div>
              <div className="bg-background-variant p-6 sticky top-24">
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

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-on py-4 font-montserrat font-medium uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  Go to Payment
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
