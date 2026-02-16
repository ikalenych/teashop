import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, AlertCircle } from "lucide-react";

export const SignInForm = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-variant p-8">
      <h2 className="font-prosto text-2xl text-primary mb-2">Welcome back!</h2>
      <p className="font-montserrat text-sm text-primary mb-6">
        Sign in to your account
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="font-montserrat text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full pl-12 pr-4 py-3 border border-outline bg-background font-montserrat text-sm text-primary focus:outline-none focus:border-primary"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-on py-3 font-montserrat font-medium uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};
