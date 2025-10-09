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
import LoginForm from './components/LoginForm.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function AppContent() {
  const { isAuthenticated, user, logout } = useAuth();

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
          {isAuthenticated && (
            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                {user?.username} ({user?.roles?.join(', ')})
              </span>
              <ul className="dropdown-menu">
                <li>
                  <button className="dropdown-item" onClick={logout}>
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          )}
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={
            <ProtectedRoute>
              <LicenseList />
            </ProtectedRoute>
          } />
          <Route path="/licenses" element={
            <ProtectedRoute>
              <LicenseList />
            </ProtectedRoute>
          } />
          <Route path="/add" element={
            <ProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <AddLicense />
            </ProtectedRoute>
          } />
          <Route path="/licenses/:id" element={
            <ProtectedRoute>
              <License />
            </ProtectedRoute>
          } />
          <Route path="/map" element={
            <ProtectedRoute>
              <LicenseMap />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <AdminPanel />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
