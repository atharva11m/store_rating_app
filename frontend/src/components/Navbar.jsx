// Navbar.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { token, role, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleTitleClick = () => {
    if (!token) {
      navigate("/");
    } else {
      window.location.reload();
    }
  };

  const isHome = location.pathname === "/";

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md text-sm h-16">
      <div
        className="cursor-pointer text-2xl font-extrabold text-blue-700 tracking-wide"
        onClick={handleTitleClick}
      >
        Store Rating App
      </div>

      <div className="flex items-center space-x-6 text-gray-700">
        <Link to="/aboutus" className="hover:underline">
          About Us
        </Link>
        <Link to="/contactus" className="hover:underline">
          Contact Us
        </Link>
        {token && user?.name && (
          <span className="font-semibold text-blue-700">{user.name}</span>
        )}

        {token && !isHome && location.pathname !== "/login" && (
          <>
            {role === "user" && (
              <Link to="/user/stores" className="hover:underline">
                User
              </Link>
            )}
            {role === "admin" && (
              <Link to="/admin/dashboard" className="hover:underline">
                Admin
              </Link>
            )}
            {role === "owner" && (
              <Link to="/owner/dashboard" className="hover:underline">
                Owner
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
