import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase"; // Ensure you import Firebase auth correctly
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("A password reset link has been sent to your email.");
      setTimeout(() => navigate("/login"), 5000); // Redirect after 5 secs
    } catch (err) {
      setError("Failed to send reset email. Please check your email address.");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-[#00CCFF]">Reset Password</h1>
        <p className="text-gray-400 text-sm text-center mt-2">Enter your email to receive a password reset link.</p>

        {message && <p className="text-green-400 text-center mt-2">{message}</p>}
        {error && <p className="text-red-400 text-center mt-2">{error}</p>}

        <form onSubmit={handleReset}>
          <div className="mt-4">
            <label className="block text-sm font-medium">Email</label>
            <div className="flex items-center border border-gray-600 rounded-md px-3 mt-1">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent p-2 outline-none text-white"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full bg-[#00CCFF] hover:bg-[#3e92e6] transition-all duration-500 text-white py-2 rounded-md mt-4 font-semibold ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <a href="/login" className="text-[#00CCFF] hover:underline">Back to Login</a>
        </div>
      </div>
    </div>
  );
}
