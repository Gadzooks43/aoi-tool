import React, { useState } from 'react';
import { loginUser } from '../utilities/databaseFunctions';
import boveyeLogo from "../boveye_logo.png";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const style = { color: "White", backgroundColor: "Black", padding: "10px", margin: "40px"};
  const logoStyle = {maxHeight: "100px", maxWidth: "100%"};
  const dataButtonStyle = {margin: "40px", display: 'block', padding: '10px 10px', textTransform: 'uppercase', cursor: 'pointer'};


  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Logging in:', username, password);
    try {
      const result = await loginUser({ username, password });
      console.log(result);
      if (result.success) {
        // redirect to main page
        window.location.href = '/boveye-aoi-tool/main';
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <img className="logo" src={boveyeLogo} alt='Logo' style={logoStyle}/> 
      <h2 style={style}>Login</h2>
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
          <label style={style}>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        <button type="submit" style={dataButtonStyle}>Login</button>
        <a href="/register" style={dataButtonStyle}>Register</a>
      </form>
    </div>
  );
}

export default Login;
