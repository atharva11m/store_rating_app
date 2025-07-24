import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminUsers from "./admin/AdminUser";
import AdminStores from "./admin/AdminStores";

const AdminDashboard = () => {
  const [tab, setTab] = useState("users");
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-center space-x-4 mt-0 mb-6">
        <button
          onClick={() => setTab("users")}
          className={`px-5 py-2 rounded ${
            tab === "users" ? "bg-blue-600 text-white" : "bg-white border"
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setTab("stores")}
          className={`px-5 py-2 rounded ${
            tab === "stores" ? "bg-blue-600 text-white" : "bg-white border"
          }`}
        >
          Stores
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-10">
        <div className="max-w-6xl mx-auto px-4 pb-10">
          {tab === "users" && <AdminUsers />}
          {tab === "stores" && <AdminStores />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
