import React from 'react';
import './NavBar.css'; // Importa lo stile per la navbar
import { FaHome, FaUser } from 'react-icons/fa'; // Importa le icone dalla libreria react-icons

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1>Fixmate</h1>
      </div>
      <div className="navbar-right">
        <FaHome className="icon" title="Home" />
        <FaUser className="icon" title="User" />
      </div>
    </nav>
  );
};

export default Navbar;
