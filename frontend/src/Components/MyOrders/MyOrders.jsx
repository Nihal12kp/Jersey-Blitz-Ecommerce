import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFileInvoice } from "react-icons/fa";
import "./MyOrders.css";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loadingInvoiceId, setLoadingInvoiceId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/order/myorders`,
          {
            headers: {
              "auth-token": token,
            },
          }
        );
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        } else {
          alert("Failed to load orders.");
        }
      } catch (err) {
        console.error("Error loading orders:", err);
        alert("Error loading orders.");
      }
    };

    fetchOrders();
  }, [navigate]);

  const downloadInvoice = async (orderId) => {
    setLoadingInvoiceId(orderId);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/order/invoice/${orderId}`,
        {
          method: "GET",
          headers: {
            "auth-token": localStorage.getItem("auth-token"),
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch invoice PDF.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice_${orderId}.pdf`;
      document.body.appendChild(a); // Optional but ensures click works
      a.click();
      a.remove(); // Clean up
      window.URL.revokeObjectURL(url); // Clean up
    } catch (err) {
      console.error("Invoice download failed:", err);
      alert("Failed to download invoice.");
    } finally {
      setLoadingInvoiceId(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="myorders-container">
        <h2>My Orders</h2>
        {orders.length === 0 ? (
          <p>No orders placed yet.</p>
        ) : (
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total (INR)</th>
                  <th>Shopping Status</th>
                  <th>Invoice</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => {
                  const date = new Date(order.createdAt).toLocaleDateString();
                  const total = order.totalAmount;

                  return (
                    <tr key={order._id}>
                      <td>{index + 1}</td>
                      <td>{date}</td>
                      <td>
                        {order.cartItems.reduce(
                          (total, item) => total + item.quantity,
                          0
                        )}{" "}                        
                      </td>

                      <td>₹{total}</td>
                      <td>{order.shoppingStatus}</td>
                      <td>
                        <button
                          className="invoice-btn"
                          onClick={() => downloadInvoice(order._id)}
                          disabled={loadingInvoiceId === order._id}
                          title="Download Invoice"
                        >
                          <span
                            className={`spinner ${
                              loadingInvoiceId === order._id
                                ? "visible"
                                : "hidden"
                            }`}
                          ></span>
                          <span
                            className={
                              loadingInvoiceId === order._id
                                ? "hidden"
                                : "visible"
                            }
                          >
                            <FaFileInvoice className="invoice-icon" /> Invoice
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer minHeight="40vh" />
    </>
  );
};

export default MyOrders;
