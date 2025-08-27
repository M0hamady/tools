import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import { MessageProvider } from "./context/MessageContext";
import SenderIds from "./pages/SenderIds";
import Messages from "./pages/Messages";
import ApiDashboard from "./pages/ApiDashboard";

function App() {
  return (
    <AuthProvider>
            <MessageProvider>

      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />
          <Route path="/documentation" element={<ApiDashboard />} />

          {/* Protected routes */}
          <Route element={<Layout />}>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
              />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
              />
            <Route
              path="/messages"
              element={
                <PrivateRoute>
                  <Messages  />
                </PrivateRoute>
              }
              />
            <Route
              path="/sender-ids"
              element={
                <PrivateRoute>
                  <SenderIds  />
                </PrivateRoute>
              }
              />
          </Route>
        </Routes>
      </Router>
              </MessageProvider>
    </AuthProvider>
  );
}

export default App;
