import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LogIn from './components/LogIn';
import Navbar from './components/Navbar';
import Home from './components/Home'; 

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<LogIn />} />
      </Routes>
    </Router>
  );
}

export default App;
