import { useState, useEffect } from "react";
import axios from "../api/axios";

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  const fetchStores = async () => {
    try {
      const res = await axios.get(`/stores${query ? `?search=${query}` : ""}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setStores(res.data);
    } catch (err) {
      console.error("Failed to fetch stores:", err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [query]);

  const handleRating = async (storeId, rating) => {
    try {
      await axios.post(`/ratings/${storeId}`, { rating });

      setStores((prevStores) =>
        prevStores.map((store) =>
          store.id === storeId ? { ...store, user_rating: rating } : store
        )
      );
    } catch (err) {
      console.error("Rating failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
        Rate Stores
      </h2>

      <div className="flex justify-center mb-6 space-x-2">
        <input
          type="text"
          placeholder="Search stores..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={() => setQuery(search)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <div
            key={store.id}
            className="bg-white shadow-md rounded-xl p-6 space-y-2"
          >
            <h3 className="text-xl font-semibold text-gray-800">
              {store.name}
            </h3>
            <p className="text-sm text-gray-600">{store.address}</p>

            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Rating:
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(store.id, star)}
                    className={`text-2xl transition ${
                      store.user_rating >= star
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserStores;
