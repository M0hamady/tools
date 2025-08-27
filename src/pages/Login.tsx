import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/dashboard");
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Login Box */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white p-6 rounded shadow w-96">
          <h2 className="text-xl font-bold mb-4">Login</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 mb-2 border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 mb-4 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
