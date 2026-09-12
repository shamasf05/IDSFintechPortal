import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Clients from "./pages/Clients";
import Dashboard from "./pages/Dashboard";
import Deployments from "./pages/Deployments";
import Environments from "./pages/Environments";
import Login from "./pages/Login";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import Register from "./pages/Register";
import Users from "./pages/Users";

const protectedPage = (page: React.ReactNode) => <ProtectedRoute>{page}</ProtectedRoute>;

export default function App() {
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/dashboard" element={protectedPage(<Dashboard />)} />
    <Route path="/products" element={protectedPage(<Products />)} />
    <Route path="/products/:id" element={protectedPage(<ProductDetails />)} />
    <Route path="/clients" element={protectedPage(<Clients />)} />
    <Route path="/deployments" element={protectedPage(<Deployments />)} />
    <Route path="/environments" element={protectedPage(<Environments />)} />
    <Route path="/users" element={protectedPage(<Users />)} />
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>;
}

