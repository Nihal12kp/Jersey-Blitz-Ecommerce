import { useEffect, useState } from "react";
import "./UsersList.css";

const UsersList = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        const response = await fetch(`${apiUrl}/admin/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        });

        const data = await response.json();
        // console.log(data);

        if (data.success) {
          setUsers(data.users);
        } else {
          setError(data.message || "Failed to fetch users");
        }
      } catch (error) {
        setError("An error occurred while fetching users");
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleBanUnban = async (userId, isBanned) => {
    try {
      const res = await fetch(`${apiUrl}/admin/user/${userId}/ban`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isBanned: !isBanned }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Ban/Unban failed:", errorText);
        return;
      }
      // const data = await res.json();
      // console.log(data);

      // If successful, update local state
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isBanned: !isBanned } : user
        )
      );
    } catch (error) {
      console.error("Error banning/unbanning user:", error);
    }
  };

  return (
    <div className="users-list">
      <h2>User List - Total : {users.length}</h2>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Cart Items</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {Object.values(user.cartData || {}).reduce(
                  (total, item) => total + item.quantity,
                  0
                )}
              </td>
              <td>{user.isBanned ? "Banned" : "Active"}</td>
              <td>
                <button onClick={() => handleBanUnban(user._id, user.isBanned)}>
                  {user.isBanned ? "Unban" : "Ban"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
