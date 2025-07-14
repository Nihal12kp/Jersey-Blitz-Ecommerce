import React, { useEffect, useState } from "react";
import "./Orders.css";
import { getDate } from "../../utils/useDate.js";

const Orders = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [orders, setOrders] = useState([]);

  const statusEmoji = {
    "Order Picked": "📦",
    "In Transit": "🚚",
    "Out for Delivery": "📍",
    Delivered: "✅",
  };
  const statusOptions = Object.keys(statusEmoji);

  useEffect(() => {
    fetch(`${apiUrl}/admin/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch((err) => console.error("Failed to fetch orders", err));
  }, [apiUrl]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${apiUrl}/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shoppingStatus: newStatus }),
      });

      if (res.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { ...order, shoppingStatus: newStatus }
              : order
          )
        );
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };
  
  return (
    <div className="orders-list">
      <h2>Orders Panel</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Order ID</th>
            <th>User</th>
            <th>Paid</th>
            <th>Date</th>
            <th>Shipping Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order._id}>
              <td>{index + 1}</td>
              <td>{order._id}</td>
              <td>
                {order.userId?.name}
                <br />
                <small>{order.userId?.email}</small>
              </td>
              <td
                style={{
                  color: order.paid ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {order.isPaid ? "Yes" : "No"}
              </td>
              <td>{getDate(order.paidAt)}</td>
              <td>
                <select
                  value={order.shoppingStatus || "Order Picked"}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {statusEmoji[status]} {status}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
