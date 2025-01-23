import React, { useEffect, useState } from 'react';
import './UsersList.css';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch users from the backend
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('auth-token'); // Get the token from localStorage
        const response = await fetch('http://localhost:4000/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token, // Include the token in the headers
          }
        });

        const data = await response.json();

        if (data.success) {
          setUsers(data.users);
        } else {
          setError(data.message || 'Failed to fetch users');
        }
      } catch (error) {
        setError('An error occurred while fetching users');
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleBan = async (userId) => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('http://localhost:4000/toggleban', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();

      if (data.success) {
        // Update the user's banned status in the state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, banned: !user.banned } : user
          )
        );
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred while updating the user status');
      console.error('Error toggling ban status:', error);
    }
  };

  return (
    <div className="users-list">
      <h2>User List</h2>
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
              <td>{user.cartData ? Object.keys(user.cartData).length : 0}</td>
              <td>{user.banned ? 'Banned' : 'Active'}</td>
              <td>
                <button onClick={() => handleToggleBan(user._id)}>
                  {user.banned ? 'Unban' : 'Ban'}
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
