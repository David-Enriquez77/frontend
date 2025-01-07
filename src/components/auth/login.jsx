import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password
  const [error, setError] = useState(""); // State for error messages
  const [success, setSuccess] = useState(false); // State for success
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Avoid default web behavior
    setError(""); // Clean previous errors
    setSuccess(false); // Reload previous success

    try {
      // post request to endpoint
      console.log("entré al try");
      const response = await axios.post("http://localhost:8000/api/login/", {
        username,
        password,
      });

      // Save tokens in local storage
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      // Redirect to success page
      setSuccess(true);
      navigate("/consultas");
    } catch (err) {
      // Handle errors
      if (err.response && err.response.data) {
        setError(err.response.data.detail || "Error de autenticación");
      } else {
        setError("Error al conectar con el servidor");
      }
    }
  };

  return (
    <Container className="mt-5">
      <h2>Iniciar Sesión</h2>

      {/* show message if login was unsuccessful */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* show message if login was successful */}
      {success && <Alert variant="success">¡Inicio de sesión exitoso!</Alert>}

      <Form onSubmit={handleSubmit}>
        {/* User field */}
        <Form.Group controlId="formUsername" className="mb-3">
          <Form.Label>Nombre de Usuario</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingresa tu nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        {/* password field */}
        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        {/* Submit button */}
        <Button variant="primary" type="submit">
          Iniciar Sesión
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
