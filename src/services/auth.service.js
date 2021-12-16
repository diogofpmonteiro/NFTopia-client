import axios from "axios";

class AuthService {
  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_SERVER_URL || "http://localhost:5005",
    });

    this.api.interceptors.request.use((config) => {
      const storedToken = localStorage.getItem("authToken");

      if (storedToken) {
        config.headers = { Authorization: `Bearer ${storedToken}` };
      }

      return config;
    });
  }

  login = async (requestBody) => {
    return this.api.post("/auth/login", requestBody);
  };

  signup = async (requestBody) => {
    return this.api.post("/auth/signup", requestBody);
  };

  verify = async () => {
    return this.api.get("/auth/verify");
  };

  delete = async () => {
    return this.api.get("api/user");
  };
}

const authService = new AuthService();

export default authService;
