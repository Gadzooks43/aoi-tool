import React, { useState } from 'react';
import { registerUser } from '../utilities/databaseFunctions';
import boveyeLogo from "../boveye_logo.png";

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const style = { color: "White", backgroundColor: "Black", padding: "10px", margin: "40px"};
  const logoStyle = {maxHeight: "100px", maxWidth: "100%"};
  const dataButtonStyle = { display: 'block', padding: '10px 10px', margin:"40px", textTransform: 'uppercase', cursor: 'pointer'};

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    console.log('Registering:', username, email, password);
    try {
      const result = await registerUser({ username, email, password });
      console.log(result); // Process the response
      // redirect to login page
      window.location.href = '/boveye-aoi-tool/';
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <img className="logo" src={boveyeLogo} alt='Logo' style={logoStyle}/> 
      <h2 style={style}>Register</h2>
      <form onSubmit={handleSubmit}>
        <div style={{marginTop: "20px", marginBottom: "20px"}}>
          <label style={style}>Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div style={{marginTop: "20px", marginBottom: "20px"}}>
          <label style={style}>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={{marginTop: "20px", marginBottom: "20px"}}>
          <label style={style}>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div style={{marginTop: "20px", marginBottom: "20px"}}>
          <label style={style}>Confirm Password:</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" style={dataButtonStyle}>Register</button>
      </form>
    </div>
  );
}

export default Register;
