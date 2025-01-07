import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track if the user is authenticated
  const [loading, setLoading] = useState(true); // State to track if the authentication check is in progress
  const navigate = useNavigate(); // useNavigate hook for programmatic navigation

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Retrieve the access token from localStorage
        const token = localStorage.getItem("accessToken");

        // If no token is found, throw an error
        if (!token) {
          throw new Error("No token found");
        }

        // Verify the token with the backend by hitting a protected endpoint
        await axios.get("${API_URL}/api/protected-endpoint", {
          headers: { Authorization: `Bearer ${token}` }, // Add the access token to the request headers
        });

        // If the token is valid, set isAuthenticated to true
        setIsAuthenticated(true);
      } catch (error) {
        // If the token is invalid or expired, handle the 401 error
        if (error.response && error.response.status === 401) {
          try {
            // Attempt to refresh the token using the refresh token
            const refreshResponse = await axios.post(
              "http://localhost:8000/api/token/refresh/",
              {
                refresh: localStorage.getItem("refreshToken"), // Send the refresh token to the backend
              }
            );

            // If successful, store the new access token in localStorage
            localStorage.setItem("accessToken", refreshResponse.data.access);

            // Set isAuthenticated to true after refreshing the token
            setIsAuthenticated(true);
          } catch (refreshError) {
            console.error("Failed to refresh token", refreshError);

            // If refreshing the token fails, remove tokens from localStorage and redirect to login
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setIsAuthenticated(false);
            navigate("/login"); // Redirect to the login page
          }
        } else {
          // Handle other errors that are not 401
          console.error("Authentication error:", error);
          setIsAuthenticated(false);
        }
      } finally {
        // Once the authentication check is complete, set loading to false
        setLoading(false);
      }
    };

    checkAuthentication(); // Call the function when the component mounts
  }, [navigate]); // Add navigate to the dependency array to avoid potential issues with closures

  // If still checking authentication, show a loading spinner or placeholder
  if (loading) {
    return <div>Loading...</div>;
  }

  // If authenticated, render the children (protected components)
  // Otherwise, redirect the user to the login page
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
