import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login/Login";
import Register from "./pages/register/Register";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import Layout from "./components/Layout";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AgentDashboard from "./pages/agent/AgentDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import Home from "./pages/home/Home";
import Properties from "./pages/properties/Properties";
import PropertyDetails from "./pages/property-details/PropertyDetails";
import Profile from "./pages/profile/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth pages - No Navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public + Protected common Navbar */}
        <Route element={<Layout />}>

          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route
            path="/properties/:propertyId"
            element={<PropertyDetails />}
          />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>

            <Route path="/profile" element={<Profile />} />

            <Route element={<RoleBasedRoute allowedRoles={["admin"]} />}>
              <Route
                path="/admin/dashboard"
                element={<AdminDashboard />}
              />
            </Route>

            <Route element={<RoleBasedRoute allowedRoles={["agent"]} />}>
              <Route
                path="/agent/dashboard"
                element={<AgentDashboard />}
              />
            </Route>

            <Route element={<RoleBasedRoute allowedRoles={["user"]} />}>
              <Route
                path="/user/dashboard"
                element={<UserDashboard />}
              />
            </Route>

          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;