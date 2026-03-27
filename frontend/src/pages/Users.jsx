import { useEffect, useState } from "react";
import API from "../api/axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  // 🔹 Fetch users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data.users);
    } catch (error) {
      console.log("Fetch users error:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Handle form change
  const handleChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Create user
  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await API.post("/users", newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers([res.data.user, ...users]);

      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "user",
      });
    } catch (error) {
      console.log("Create user error:", error);
      alert(error.response?.data?.message || "Failed to create user");
    }
  };

  // 🔹 Block / Unblock
  const handleBlock = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/users/${id}/block`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUsers(
        users.map((user) =>
          user._id === id ? { ...user, isBlocked: !user.isBlocked } : user,
        ),
      );
    } catch (error) {
      console.log("Block error:", error);
    }
  };

  // 🔹 Delete user
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  // 🔹 Role change
  const handleRoleChange = async (id, newRole) => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.patch(
        `/users/${id}/role`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(
        users.map((user) =>
          user._id === id ? { ...user, role: res.data.role } : user,
        ),
      );
    } catch (error) {
      console.log("Role change error:", error);
    }
  };

  return (
    <div className="p-6 text-white bg-gray-950 min-h-screen grid grid-cols-3 gap-6">
      {/* CREATE USER */}
      <div className="bg-gray-800 p-4 rounded">
        <h2 className="text-xl mb-4">Add New User</h2>
        <form onSubmit={handleCreateUser} className="space-y-3">
          <input
            name="name"
            placeholder="Name"
            value={newUser.name}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 rounded"
          />

          <input
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 rounded"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 rounded"
          />

          <select
            name="role"
            value={newUser.role}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 rounded"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button className="w-full bg-green-600 p-2 rounded">
            + Create User
          </button>
        </form>
      </div>

      {/* USERS TABLE */}
      <div className="col-span-2 bg-gray-900 rounded overflow-x-auto border border-gray-700">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-700">
              <th className="p-3">User</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-gray-700">
                <td className="p-3">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </td>

                {/* ROLE DROPDOWN */}
                <td className="p-3">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className={`px-2 py-1 rounded text-sm ${
                      user.role === "admin"
                        ? "bg-amber-600 text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>

                {/* STATUS */}
                <td className="p-3">
                  {user.isBlocked ? (
                    <span className="text-red-500 flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Blocked
                    </span>
                  ) : (
                    <span className="text-green-500 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Active
                    </span>
                  )}
                </td>

                {/* ACTIONS DROPDOWN */}
                <td className="p-3">
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      const action = e.target.value;
                      if (action === "block") handleBlock(user._id);
                      if (action === "delete") handleDelete(user._id);
                      e.target.value = "";
                    }}
                    className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
                  >
                    <option value="" disabled>
                      Actions
                    </option>
                    <option value="block">
                      {user.isBlocked ? "Unblock" : "Block"}
                    </option>
                    <option value="delete">Delete</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
