import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/auth/login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Consultas from './components/consultas/consultas';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/consultas"
          element={
            <ProtectedRoute>
              <Consultas />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
