const request = async (endpoint, method = "GET", body = null, auth = false) => {
  const headers = {};

  if (auth) {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const config = {
    method,
    headers,
  };

  // If body is FormData, don't set Content-Type at all; fetch will handle it.
  if (body instanceof FormData) {
    config.body = body;
  } else if (body) {
    headers["Content-Type"] = "application/json";
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`http://127.0.0.1:8080${endpoint}`, config);
    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // No JSON response body
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error in ${method} ${endpoint}:`, error);
    throw error;
  }
};

export default request;
