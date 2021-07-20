import { useRef } from "react";
import { Link } from "react-router-dom";
import "./register.css";
import axios from "axios";
import { useHistory } from "react-router";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory(); //can be used to direct users to previous and any other page

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };

      try {
        await axios.post("/api/auth/register", user);
        history.push("/");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">ReachMe</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on ReachMe.
          </span>
        </div>
        <div className="loginRight">
          <form onSubmit={handleSubmit} className="loginBox">
            <input
              required
              placeholder="Username"
              ref={username}
              className="loginInput"
            />
            <input
              required
              placeholder="Email"
              ref={email}
              className="loginInput"
              type="email"
            />
            <input
              required
              placeholder="Password"
              ref={password}
              className="loginInput"
              type="password"
              minLength={5}
            />
            <input
              required
              placeholder="Password Again"
              ref={passwordAgain}
              className="loginInput"
              type="password"
            />
            <button type="submit" className="loginButton">
              Sign Up
            </button>
            <Link to="/login">
              <button className="loginRegisterButton">Log into Account</button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
