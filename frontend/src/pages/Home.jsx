import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.errors ? data.errors.join(" ") : "Registration failed"
        );
      }

      setMessage("Registration successful! Please login.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Welcome to the Store Rating App
        </h2>
        <p className="text-gray-600 max-w-xl mb-6">
          Easily rate, manage, and explore the best stores in your city. Click
          the button below to get started.
        </p>

        <Link
          to="/signup"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition inline-block"
        >
          Get Started
        </Link>

        {showForm && (
          <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 mt-8 text-left">
            <h3 className="text-xl font-semibold mb-4 text-blue-700">
              Register
            </h3>

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            {message && (
              <p className="text-green-600 text-sm mb-2">{message}</p>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                required
                className="w-full border border-gray-300 p-2 rounded"
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="w-full border border-gray-300 p-2 rounded"
                onChange={handleChange}
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                className="w-full border border-gray-300 p-2 rounded"
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                className="w-full border border-gray-300 p-2 rounded"
                onChange={handleChange}
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Register
              </button>
            </form>

            <p className="text-sm text-center mt-4 text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
