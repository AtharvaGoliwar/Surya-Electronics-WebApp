// src/Login.js

import React from 'react';
import './Login.css'; // We'll create this CSS file next for styling

const Login = () => {
  return (
    <div className="login-container">
      <form className="login-form">
        <h2>Login To Your Account</h2>
        <div className="input-group">
          <label htmlFor="email">Username or Email Address</label>
          <input type="text" id="email" name="email" required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Continue</button>
      </form>
    </div>
  );
};

export default Login;
