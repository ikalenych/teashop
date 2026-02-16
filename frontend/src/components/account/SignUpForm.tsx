import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, User, AlertCircle } from "lucide-react";

export const SignUpForm = () => {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(name, email, password);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-variant p-8">
      <h2 className="font-prosto text-2xl text-primary mb-2">Create Account</h2>
      <p className="font-montserrat text-sm text-primary mb-6">
        Join us for exclusive benefits
      </p>

      {/* Benefits */}
      <ul className="space-y-2 mb-6">
        <li className="flex items-start gap-2 font-montserrat text-sm text-primary">
          <span className="text-secondary">→</span>
          Track your orders
        </li>
        <li className="flex items-start gap-2 font-montserrat text-sm text-primary">
          <span className="text-secondary">→</span>
          Faster checkout
        </li>
        <li className="flex items-start gap-2 font-montserrat text-sm text-primary">
          <span className="text-secondary">→</span>
          10% discount for new customers
        </li>
      </ul>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="font-montserrat text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary opacity-60" />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full pl-12 pr-4 py-3 border border-outline bg-background font-montserrat text-sm text-primary focus:outline-none focus:border-primary"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary opacity-60" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-12 pr-4 py-3 border border-outline bg-background font-montserrat text-sm text-primary focus:outline-none focus:border-primary"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary opacity-60" />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full pl-12 pr-4 py-3 border border-outline bg-background font-montserrat text-sm text-primary focus:outline-none focus:border-primary"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-on py-3 font-montserrat font-medium uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};
