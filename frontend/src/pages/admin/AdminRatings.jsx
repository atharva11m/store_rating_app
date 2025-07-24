import { useEffect, useState } from "react";
import axios from "../../api/axios";

const AdminRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [filters, setFilters] = useState({
    store: "",
    user: "",
    rating: "",
  });

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    const res = await axios.get("/ratings/admin-view");
    setRatings(res.data);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    const filtered = ratings.filter((r) => {
      return (
        (filters.store === "" ||
          r.store_name.toLowerCase().includes(filters.store.toLowerCase())) &&
        (filters.user === "" ||
          r.user_name.toLowerCase().includes(filters.user.toLowerCase())) &&
        (filters.rating === "" || r.rating === parseInt(filters.rating))
      );
    });
    setFiltered(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this rating?")) return;
    await axios.delete(`/ratings/${id}`);
    fetchRatings();
  };

  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    setFiltered(ratings);
  }, [ratings]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="text-lg font-semibold mb-2">Filter Ratings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <input
            type="text"
            name="store"
            placeholder="Store name"
            onChange={handleFilterChange}
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            name="user"
            placeholder="User name"
            onChange={handleFilterChange}
            className="border rounded px-3 py-2"
          />
          <select
            name="rating"
            onChange={handleFilterChange}
            className="border rounded px-3 py-2"
          >
            <option value="">All Ratings</option>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r} ⭐
              </option>
            ))}
          </select>
          <button
            onClick={applyFilters}
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="bg-white shadow p-4 rounded flex justify-between items-center"
          >
            <div>
              <p>
                <span className="font-semibold">{r.user_name}</span> rated{" "}
                <span className="font-semibold">{r.store_name}</span>{" "}
                <span className="text-yellow-600 font-medium">
                  {r.rating} ⭐
                </span>
              </p>
              <p className="text-sm text-gray-500">{r.created_at}</p>
            </div>
            <button
              onClick={() => handleDelete(r.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRatings;
