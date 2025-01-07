import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_API_URL;

const apiInstance = axios.create({
  baseURL: API_URL,
});

// Config to handle error 401
apiInstance.interceptors.response.use(
  (response) => response, // Success response
  async (error) => {
    const originalRequest = error.config;

    // Check if error.response exists before accesing to status
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // refresh token
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          const response = await axios.post(`${API_URL}/token/refresh/`, {
            refresh: refreshToken,
          });

          // Storage new token
          localStorage.setItem("accessToken", response.data.access);

          // Update headers auth from original request
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${response.data.access}`;

          // Try request again with original request
          return apiInstance(originalRequest);
        } else {
          // If there's no refresh token show error
          console.log("No refresh token found");
        }
      } catch (refreshError) {
        // Handle Error
        console.error("Failed to refresh token", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error); //  Reject if there's no error 401
  }
);

// Make a petition to protected endpoint
apiInstance
  .get("/protected-endpoint")
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

export default apiInstance;
