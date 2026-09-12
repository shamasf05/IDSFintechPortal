import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/login");
  }

  return <header className="navbar">
    <div className="navbar-brand"><div className="brand-logo">IDS</div><div><div className="brand-title">IDS Fintech</div><div className="brand-subtitle">Products Portal</div></div></div>
    <nav className="navbar-links">
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/products">Products</NavLink>
      <NavLink to="/clients">Clients</NavLink>
      <NavLink to="/deployments">Deployments</NavLink>
      <NavLink to="/environments">Environments</NavLink>
      {role === "CEO" || role === "Manager" ? <NavLink to="/users">Users</NavLink> : null}
    </nav>
    <div className="navbar-user"><div className="user-info"><strong>{username || "User"}</strong><span>{role || "Employee"}</span></div><button className="logout-button" onClick={logout}>Logout</button></div>
  </header>;
}

