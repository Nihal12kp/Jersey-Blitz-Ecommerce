import './CSS/SignUp.css'; // Assuming you have a combined CSS file
import Navbar from '../Components/Navbar/Navbar';
import { useState } from 'react';
import Footer from '../Components/Footer/Footer';

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

  // Login function to call the backend login endpoint
  const login = async () => {
    console.log("Login function Exicuted");
    let responseData;
    await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        
        email: formdata.email,
        password: formdata.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token); // Store the token
      window.location.replace("/"); // Redirect to home page
    } else {
      setErrorMessage(responseData.errors || "Login failed. Please try again."); // Display error if login fails
    }
  };

  // Signup function to call the backend signup endpoint
  const signup = async () => {
    console.log("signup function exicuted");
    try {
      const response = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
        },
        body: JSON.stringify({
          username: formdata.username, // Ensure consistent naming
          email: formdata.email,
          password: formdata.password,
        }),
      });
  
      const responseData = await response.json();
      console.log(responseData); // Log response for debugging
  
      if (response.ok && responseData.success) {
        localStorage.setItem('auth-token', responseData.token); // Store the token
        window.location.replace("/"); // Redirect to home page
      } else {
        setErrorMessage(responseData.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null); // Clear previous errors
    if (state === "Login") {
      login(); // Call login function
    } else {
      signup(); // Call signup function
    }
  };

  return (
    <div>
      <Navbar />
      <div className="loginsingup">
        <div className="loginsingup-container">
          <h1>{state}</h1>

          {/* Display error message if any */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {/* Form for login/signup */}
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
                autoComplete={state === "Login" ? "current-password" : "new-password"}
              />
            </div>
            <button type="submit">Continue</button>
          </form>

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

          <div className="loginsignup-agree">
            <input type="checkbox" name="" id="" required />
            <p>By continuing, I agree to the terms of use & privacy policy</p>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default LoginSignup;
