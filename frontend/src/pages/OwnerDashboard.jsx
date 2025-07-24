import { useEffect, useState } from "react";
import axios from "../api/axios";

const OwnerDashboard = () => {
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [form, setForm] = useState({ name: "", address: "", email: "" });
  const [message, setMessage] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [showRatings, setShowRatings] = useState(false);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    fetchStore();
    fetchOwnerInfo();
  }, []);

  const fetchStore = async () => {
    try {
      const res = await axios.get("/stores/my-stores");
      setStores(res.data || []);
    } catch (err) {
      console.error("Failed to fetch store:", err);
    }
  };

  const fetchOwnerInfo = async () => {
    try {
      const res = await axios.get("/users/me");
      setOwnerName(res.data.name);
    } catch (err) {
      console.error("Failed to fetch owner info:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/stores", form);
      setMessage("Store added successfully!");
      setForm({ name: "", address: "", email: "" });
      fetchStore();
    } catch (err) {
      console.error("Error adding store:", err.response?.data || err.message);
      setMessage("Failed to add store");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      {!store ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow space-y-4 max-w-md mx-auto"
        >
          <h2 className="text-xl font-semibold text-gray-800">Add New Store</h2>
          {message && (
            <p className="text-sm text-center text-green-600">{message}</p>
          )}
          <input
            type="text"
            name="name"
            placeholder="Store Name"
            required
            className="w-full border border-gray-300 p-3 rounded"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="text"
            name="address"
            placeholder="Store Address"
            required
            className="w-full border border-gray-300 p-3 rounded"
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <input
            type="email"
            name="email"
            placeholder="Store Contact Email"
            required
            className="w-full border border-gray-300 p-3 rounded"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Submit Store
          </button>
        </form>
      ) : (
        <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Your Store Details
          </h2>
          <p>
            <strong>Name:</strong> {store.name}
          </p>
          <p>
            <strong>Address:</strong> {store.address}
          </p>
          <p>
            <strong>Contact:</strong> {store.email}
          </p>
          <p>
            <strong>Status:</strong> {store.approved ? "Approved" : "Pending"}
          </p>
        </div>
      )}

      {store && (
        <div className="text-center">
          <button
            onClick={() => setShowRatings(!showRatings)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            {showRatings ? "Hide Ratings" : "Store Ratings"}
          </button>
        </div>
      )}

      {showRatings && ratings.length > 0 && (
        <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Store Ratings
          </h2>
          <ul className="space-y-2">
            {ratings.map((r, index) => (
              <li
                key={index}
                className="border-b pb-2 text-sm text-gray-700 flex justify-between"
              >
                <span>
                  <strong>{r.name}</strong> rated{" "}
                  <span className="text-yellow-600 font-semibold">
                    {r.rating}⭐
                  </span>
                </span>
                <span className="text-gray-400 text-xs">{r.created_at}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {stores.length > 0 && (
        <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            My Submitted Stores
          </h2>
          <ul className="space-y-4">
            {stores.map((store) => (
              <li key={store.id} className="border-b pb-4">
                <p>
                  <strong>Name:</strong> {store.name}
                </p>
                <p>
                  <strong>Address:</strong> {store.address}
                </p>
                <p>
                  <strong>Contact:</strong> {store.email}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {store.approved ? "Approved" : "Pending"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
