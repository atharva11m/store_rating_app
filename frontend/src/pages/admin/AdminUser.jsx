import { useEffect, useState } from "react";
import axios from "../../api/axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("/users?role=user");
    setUsers(res.data);
    setFilteredUsers(res.data);
  };

  const handleSearch = () => {
    const filtered = users.filter((u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    await axios.delete(`/users/${userId}`);
    const updated = users.filter((u) => u.id !== userId);
    setUsers(updated);
    setFilteredUsers(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          className="w-full sm:w-1/2 border border-gray-300 rounded px-4 py-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white shadow p-4 rounded">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">{user.address}</p>
              </div>
              <button
                onClick={() => handleDelete(user.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>

            {user.submitted_stores?.length > 0 && (
              <div className="mt-2 text-sm">
                <p className="font-semibold">Submitted Stores:</p>
                <ul className="list-disc list-inside text-gray-700">
                  {user.submitted_stores.map((s) => (
                    <li key={s.id}>{s.name}</li>
                  ))}
                </ul>
              </div>
            )}

            {user.ratings?.length > 0 && (
              <div className="mt-2 text-sm">
                <p className="font-semibold">Ratings:</p>
                <ul className="list-disc list-inside text-gray-700">
                  {user.ratings.map((r, i) => (
                    <li key={i}>
                      {r.store_name} - {r.rating} ⭐
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
