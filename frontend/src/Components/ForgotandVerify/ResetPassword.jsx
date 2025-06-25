import "./commonfv.css";
import { useState } from "react";
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleReset = async () => {
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();
    if (!trimmedPassword || !trimmedConfirmPassword) {
      setError("Please fill out all fields!");
      return;
    }
    if (trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("");
      setError("Passwords do not match");
      return;
    }

    const res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/auth/reset-password/${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      }
    );

    const data = await res.json();
    if (res.ok) {
      setMessage(data.message);
      setError("");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setError(data.message || "Failed to reset password.");
      setMessage("");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="fv-container">
      <div className="fv-card">
        <h2>Set New Password</h2>

        <div className="fv-password-field">
          <input
            className="fv-input"
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="fv-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <input
          className="fv-input"
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button className="fv-button" onClick={handleReset}>
          Change Password
        </button>

        {message && <p className="fv-message">{message}</p>}
        {error && <p className="fv-error">{error}</p>}
      </div>
    </div>
    <Footer/>
    </>
  );
}
