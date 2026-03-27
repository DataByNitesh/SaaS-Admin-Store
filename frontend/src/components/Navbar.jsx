import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkStyle = "relative group cursor-pointer";

  const underline =
    "absolute left-0 -bottom-1 h-[2px] w-0 bg-red-500 transition-all duration-300 group-hover:w-full";

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <h1 className="text-xl font-bold">Admin Panel</h1>

      {/* Links */}
      <div className="flex items-center gap-6">
        <Link to="/products" className={linkStyle}>
          Products
          <span className={underline}></span>
        </Link>

        {isAdmin && (
          <Link to="/users" className={linkStyle}>
            Users
            <span className={underline}></span>
          </Link>
        )}

        <Link to="/dashboard" className={linkStyle}>
          Dashboard
          <span className={underline}></span>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
