import { useEffect, useState } from "react";
import axios from "../../api/axios";

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    const res = await axios.get("/stores/admin-view");
    setStores(res.data);
  };

  const filtered = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this store?")) return;
    await axios.delete(`/stores/${id}`);
    fetchStores();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-6">
        <input
          type="text"
          placeholder="Search by name, email or address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-2/3 border border-gray-300 rounded px-4 py-2"
        />
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500">No matching stores found.</p>
        ) : (
          filtered.map((store) => (
            <div
              key={store.id}
              className="bg-white shadow p-4 rounded space-y-1"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {store.name}
              </h3>
              <p className="text-sm text-gray-600">Email: {store.email}</p>
              <p className="text-sm text-gray-600">Address: {store.address}</p>
              <p className="text-sm text-gray-600">
                Owner: {store.owner_name} ({store.owner_email})
              </p>
              <p className="text-sm text-yellow-600">
                ⭐ Avg Rating: {Number(store.avg_rating).toFixed(1)}
              </p>

              <div className="mt-2">
                <button
                  onClick={() => handleDelete(store.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminStores;
