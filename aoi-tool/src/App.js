import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Main from './components/Main';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/main" element={<Main />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
