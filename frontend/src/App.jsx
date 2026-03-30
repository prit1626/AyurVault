import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import PublisherRoute from './routes/PublisherRoute';
import PublisherDashboard from './pages/publisher/PublisherDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/publisher/dashboard" 
          element={
            <PublisherRoute>
              <PublisherDashboard />
            </PublisherRoute>
          } 
        />
        <Route 
          path="/publisher/upload" 
          element={
            <PublisherRoute>
              <PublisherDashboard />
            </PublisherRoute>
          } 
        />
        <Route 
          path="/publisher/mynotes" 
          element={
            <PublisherRoute>
              <PublisherDashboard />
            </PublisherRoute>
          } 
        />
        <Route 
          path="/publisher/analytics" 
          element={
            <PublisherRoute>
              <PublisherDashboard />
            </PublisherRoute>
          } 
        />
        <Route 
          path="/publisher/earnings" 
          element={
            <PublisherRoute>
              <PublisherDashboard />
            </PublisherRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
