import { useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "user",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await axios.post("/auth/register", form);
      setMessage("Registration successful! You can now log in.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(" "));
      } else {
        setError("Something went wrong.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-blue-700">
          Register
        </h2>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        {message && (
          <p className="text-sm text-green-600 text-center">{message}</p>
        )}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          onChange={handleChange}
          required
        />
        <div className="space-y-1">
          <label className="block text-gray-700 font-medium">
            Register as:
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="user">User</option>
            <option value="owner">Store Owner</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Sign Up
        </button>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
