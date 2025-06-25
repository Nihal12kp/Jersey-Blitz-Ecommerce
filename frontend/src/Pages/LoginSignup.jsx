import "./CSS/SignUp.css"; // Assuming you have a combined CSS file
import Navbar from "../Components/Navbar/Navbar";
import { useState } from "react";
import Footer from "../Components/Footer/Footer";
import { Link } from "react-router-dom";

export const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formdata, setFormdata] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [errorMessage, setErrorMessage] = useState(null); // To display errors

  const changeHandler = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const login = async () => {
    console.log("Login function Exicuted");
    let responseData;
    await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formdata.email,
        password: formdata.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      localStorage.setItem("auth-token", responseData.token);
      window.location.replace("/");
    } else {
      setErrorMessage(responseData.errors || "Login failed. Please try again.");
    }
  };

  const signup = async () => {
    console.log("signup function exicuted");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formdata.username,
            email: formdata.email,
            password: formdata.password,
          }),
        }
      );

      const responseData = await response.json();
      console.log(responseData);

      if (response.ok && responseData.success) {
        localStorage.setItem("auth-token", responseData.token);
        window.location.replace("/");
      } else {
        setErrorMessage(
          responseData.error || "Signup failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);
    if (state === "Login") {
      login();
    } else {
      signup();
    }
  };

  return (
    <div>
      <Navbar />
      <div className="loginsingup">
        <div className="loginsingup-container">
          <h1>{state}</h1>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <form onSubmit={handleSubmit}>
            <div className="loginsignup-fields">
              {state === "Sign Up" && (
                <input
                  type="text"
                  name="username"
                  value={formdata.username}
                  onChange={changeHandler}
                  placeholder="Your Name"
                  required
                  autoComplete="username"
                />
              )}
              <input
                type="email"
                name="email"
                value={formdata.email}
                onChange={changeHandler}
                placeholder="Email"
                required
                autoComplete="email"
              />
              <input
                type="password"
                name="password"
                value={formdata.password}
                onChange={changeHandler}
                placeholder="Password"
                required
                autoComplete={
                  state === "Login" ? "current-password" : "new-password"
                }
              />
            </div>

            {/* ✅ Moved checkbox before button */}
            <div className="loginsignup-agree">
              <input type="checkbox" required />
              <p>By continuing, I agree to the terms of use & privacy policy</p>
            </div>

            <button type="submit">Continue</button>
          </form>
          <Link to="/forgotpassword">Forgot Password?</Link>
          {state === "Sign Up" ? (
            <p className="loginsignup-login">
              Already have an account?
              <span onClick={() => setState("Login")} className="mypointer">
                Login here
              </span>
            </p>
          ) : (
            <p className="loginsignup-login">
              Create an account?
              <span onClick={() => setState("Sign Up")} className="mypointer">
                Click here
              </span>
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginSignup;
