import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

import AddLicense from './components/AddLicense.jsx';
import License from './components/License.jsx';
import LicenseList from './components/LicenseList.jsx';
import LicenseMap from './components/LicenseMap.jsx';
import FeeAdjustment from './components/FeeAdjustment.jsx';
import LicenseComparison from './components/LicenseComparison.jsx';
import AdminPanel from './components/AdminPanel.jsx';

function App() {
  return (
    <Router>
      <nav className="navbar">
        <a href="/licenses" className="navbar-brand">
          Licensing
        </a>
        <div className="navbar-nav">
          <li className="nav-item">
            <Link to={"/licenses"} className="nav-link">
              Licenses
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/add"} className="nav-link">
              Add
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/map"} className="nav-link">
              Map & Reports
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/admin"} className="nav-link">
              Admin Tools
            </Link>
          </li>
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<LicenseList />} />
          <Route path="/licenses" element={<LicenseList />} />
          <Route path="/add" element={<AddLicense />} />
          <Route path="/licenses/:id" element={<License />} />
          <Route path="/map" element={<LicenseMap />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
