import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { api } from "../lib/api";

const DELIVERY_COST = 3.95;

export const Payment = () => {
  const { items, subtotal, clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const { shippingAddress, billingAddress, contactInfo } = location.state || {};

  // Якщо немає даних - редирект
  if (!shippingAddress) {
    navigate("/cart");
    return null;
  }

  const [paymentType, setPaymentType] = useState<"card" | "advanced">("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
  });
  const [loading, setLoading] = useState(false);

  const total = subtotal + DELIVERY_COST;

  // Форматування номера карти (XXXX XXXX XXXX XXXX)
  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const limited = numbers.slice(0, 16);
    const formatted = limited.match(/.{1,4}/g)?.join(" ") || limited;
    return formatted;
  };

  // Форматування expiry date (MM/YY)
  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const limited = numbers.slice(0, 4);
    if (limited.length >= 3) {
      return `${limited.slice(0, 2)}/${limited.slice(2)}`;
    }
    return limited;
  };

  // Форматування CVC (3 цифри)
  const formatCVC = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.slice(0, 3);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardDetails({ ...cardDetails, number: formatted });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    setCardDetails({ ...cardDetails, expiry: formatted });
  };

  const handleCVCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCVC(e.target.value);
    setCardDetails({ ...cardDetails, cvc: formatted });
  };

  // Валідація карти перед submit
  const isCardValid = () => {
    const numbersOnly = cardDetails.number.replace(/\s/g, "");
    return (
      numbersOnly.length === 16 &&
      cardDetails.expiry.length === 5 &&
      cardDetails.cvc.length === 3
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentType === "card" && !isCardValid()) {
      alert("Please enter valid card details");
      return;
    }

    setLoading(true);

    try {
      // Підготовка даних для API
      const orderData = {
        shippingFirstName: shippingAddress.firstName,
        shippingLastName: shippingAddress.lastName,
        shippingStreet: shippingAddress.street,
        shippingPostCode: shippingAddress.postCode,
        shippingCity: shippingAddress.city,
        shippingCountry: shippingAddress.country,
        billingSameAsShipping: billingAddress.sameAsShipping,
        billingFirstName: billingAddress.sameAsShipping
          ? shippingAddress.firstName
          : billingAddress.firstName,
        billingLastName: billingAddress.sameAsShipping
          ? shippingAddress.lastName
          : billingAddress.lastName,
        billingStreet: billingAddress.sameAsShipping
          ? shippingAddress.street
          : billingAddress.street,
        billingPostCode: billingAddress.sameAsShipping
          ? shippingAddress.postCode
          : billingAddress.postCode,
        billingCity: billingAddress.sameAsShipping
          ? shippingAddress.city
          : billingAddress.city,
        billingCountry: billingAddress.sameAsShipping
          ? shippingAddress.country
          : billingAddress.country,
        email: contactInfo.email,
        paymentType:
          paymentType === "card" ? "credit_card" : "advanced_payment",
        items: items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      };

      // Створюємо замовлення
      const order = await api.createOrder(orderData);

      // Переходимо на Thank You page СПОЧАТКУ
      navigate(`/thank-you/${order.id}`, { replace: true });

      // Очищуємо корзину ПІСЛЯ (setTimeout щоб не заблокувати навігацію)
      setTimeout(() => {
        clearCart();
      }, 100);
    } catch (error) {
      console.error("Order creation failed:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
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

          {/* Step 2 - Completed */}
          <div className="flex-1 ml-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary text-secondary-on flex items-center justify-center font-montserrat font-bold">
                ✓
              </div>
              <span className="font-montserrat font-semibold text-primary uppercase text-sm">
                Delivery
              </span>
            </div>
            <div className="h-1 bg-secondary mt-2"></div>
          </div>

          {/* Step 3 - Active */}
          <div className="flex-1 ml-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-on flex items-center justify-center font-montserrat font-bold">
                3
              </div>
              <span className="font-montserrat font-semibold text-primary uppercase text-sm">
                Review & Payment
              </span>
            </div>
            <div className="h-1 bg-primary mt-2"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Delivery Details + Payment */}
            <div className="lg:col-span-2 space-y-8">
              {/* Delivery Details */}
              <div>
                <h2 className="font-prosto text-2xl text-primary mb-6">
                  Delivery Details
                </h2>

                <div className="bg-background-variant p-6 space-y-4">
                  <div>
                    <h3 className="font-montserrat font-semibold text-sm uppercase text-primary mb-2">
                      Shipping address
                    </h3>
                    <p className="font-montserrat text-sm text-primary">
                      {shippingAddress.firstName} {shippingAddress.lastName}
                      <br />
                      {shippingAddress.street}
                      <br />
                      {shippingAddress.postCode}, {shippingAddress.city}
                      <br />
                      {shippingAddress.country}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-montserrat font-semibold text-sm uppercase text-primary mb-2">
                      Billing address
                    </h3>
                    <p className="font-montserrat text-sm text-primary">
                      {billingAddress.sameAsShipping ? (
                        "Same as shipping address"
                      ) : (
                        <>
                          {billingAddress.firstName} {billingAddress.lastName}
                          <br />
                          {billingAddress.street}
                          <br />
                          {billingAddress.postCode}, {billingAddress.city}
                          <br />
                          {billingAddress.country}
                        </>
                      )}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-montserrat font-semibold text-sm uppercase text-primary mb-2">
                      Contact information
                    </h3>
                    <p className="font-montserrat text-sm text-primary">
                      {contactInfo.email}
                    </p>
                  </div>

                  <Link
                    to="/checkout"
                    state={{ shippingAddress, billingAddress, contactInfo }}
                    className="inline-block font-montserrat text-sm text-secondary hover:underline uppercase"
                  >
                    Edit Details
                  </Link>
                </div>
              </div>

              {/* Payment Type */}
              <div>
                <h2 className="font-prosto text-2xl text-primary mb-6">
                  Payment type
                </h2>

                <div className="space-y-4">
                  {/* Card Payment */}
                  <div
                    onClick={() => setPaymentType("card")}
                    className={`
                      border-2 p-6 cursor-pointer transition-all
                      ${paymentType === "card" ? "border-primary bg-background-variant" : "border-outline hover:border-primary"}
                    `}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <input
                        type="radio"
                        name="paymentType"
                        checked={paymentType === "card"}
                        onChange={() => setPaymentType("card")}
                        className="w-4 h-4 accent-primary cursor-pointer"
                      />
                      <span className="font-montserrat font-semibold text-primary">
                        Credit or Debit card
                      </span>
                      <div className="flex gap-2 ml-auto">
                        <div className="w-10 h-6 bg-primary text-primary-on flex items-center justify-center text-xs font-bold">
                          VISA
                        </div>
                        <div className="w-10 h-6 bg-primary text-primary-on flex items-center justify-center text-xs font-bold">
                          MC
                        </div>
                        <div className="w-10 h-6 bg-primary text-primary-on flex items-center justify-center text-xs font-bold">
                          iD
                        </div>
                      </div>
                    </div>

                    {paymentType === "card" && (
                      <div className="space-y-4 mt-4">
                        <div>
                          <input
                            type="text"
                            placeholder="Card Number"
                            value={cardDetails.number}
                            onChange={handleCardNumberChange}
                            required
                            maxLength={19}
                            className={`
                              w-full border px-4 py-3 font-montserrat text-sm text-primary focus:outline-none bg-background
                              ${
                                cardDetails.number &&
                                cardDetails.number.replace(/\s/g, "").length ===
                                  16
                                  ? "border-secondary"
                                  : "border-outline focus:border-primary"
                              }
                            `}
                          />
                          <p className="font-montserrat text-xs text-primary opacity-60 mt-1">
                            {cardDetails.number.replace(/\s/g, "").length}/16
                            digits
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <input
                              type="text"
                              placeholder="Expired date (MM/YY)"
                              value={cardDetails.expiry}
                              onChange={handleExpiryChange}
                              required
                              maxLength={5}
                              className={`
                                w-full border px-4 py-3 font-montserrat text-sm text-primary focus:outline-none bg-background
                                ${
                                  cardDetails.expiry.length === 5
                                    ? "border-secondary"
                                    : "border-outline focus:border-primary"
                                }
                              `}
                            />
                          </div>

                          <div>
                            <input
                              type="text"
                              placeholder="CVC"
                              value={cardDetails.cvc}
                              onChange={handleCVCChange}
                              required
                              maxLength={3}
                              className={`
                                w-full border px-4 py-3 font-montserrat text-sm text-primary focus:outline-none bg-background
                                ${
                                  cardDetails.cvc.length === 3
                                    ? "border-secondary"
                                    : "border-outline focus:border-primary"
                                }
                              `}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Advanced Payment */}
                  <div
                    onClick={() => setPaymentType("advanced")}
                    className={`
                      border-2 p-6 cursor-pointer transition-all
                      ${paymentType === "advanced" ? "border-primary bg-background-variant" : "border-outline hover:border-primary"}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentType"
                        checked={paymentType === "advanced"}
                        onChange={() => setPaymentType("advanced")}
                        className="w-4 h-4 accent-primary cursor-pointer"
                      />
                      <span className="font-montserrat font-semibold text-primary uppercase">
                        Advanced Payment
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
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
                  disabled={
                    loading || (paymentType === "card" && !isCardValid())
                  }
                  className={`
                    w-full py-4 font-montserrat font-medium uppercase tracking-wider transition-opacity
                    ${
                      loading || (paymentType === "card" && !isCardValid())
                        ? "bg-outline text-primary opacity-50 cursor-not-allowed"
                        : "bg-primary text-primary-on hover:opacity-90"
                    }
                  `}
                >
                  {loading ? "Processing..." : "Pay"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
