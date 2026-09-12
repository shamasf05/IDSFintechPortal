import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

import {
  approveUser,
  getProducts,
  getClients,
  getDeployments,
  getModules,
  getEnvironments,
  getPendingUsers,
} from "../services/api";

import type { PendingUser } from "../types";

export default function Dashboard() {
  const [counts, setCounts] = useState({
    products: 0,
    clients: 0,
    deployments: 0,
    environments: 0,
    modules: 0,
    pendingUsers: 0,
  });

  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState("");

  const role = localStorage.getItem("role");

  const isManager =
    role?.toLowerCase() === "manager" ||
    role?.toLowerCase() === "ceo";

  useEffect(() => {
    loadDashboard();

    if (isManager) {
      loadPendingUsers();
    }
  }, [isManager]);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [
        products,
        clients,
        deployments,
        modules,
        environments,
      ] = await Promise.all([
        getProducts(),
        getClients(),
        getDeployments(),
        getModules(),
        getEnvironments(),
      ]);

      setCounts((current) => ({
        ...current,
        products: products.length,
        clients: clients.length,
        deployments: deployments.length,
        modules: modules.length,
        environments: environments.length,
      }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadPendingUsers() {
    try {
      setLoadingUsers(true);

      const users = await getPendingUsers();

      setPendingUsers(users);

      // IMPORTANT:
      // The dashboard count comes directly from
      // the actual pending-users list.
      setCounts((current) => ({
        ...current,
        pendingUsers: users.length,
      }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load pending users."
      );
    } finally {
      setLoadingUsers(false);
    }
  }

  async function handleApprove(id: number) {
    try {
      setError("");

      await approveUser(id);

      // Remove the approved employee immediately
      // from the displayed list.
      setPendingUsers((users) =>
        users.filter((user) => user.id !== id)
      );

      // Update the dashboard number immediately.
      setCounts((current) => ({
        ...current,
        pendingUsers: Math.max(
          0,
          current.pendingUsers - 1
        ),
      }));

      // Ask the backend again to make sure the
      // displayed data matches the database.
      await loadPendingUsers();

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not approve user."
      );
    }
  }

  return (
    <div className="app">
      <Navbar />

      <main className="page-container">

        <div className="page-header">
          <div>
            <h1>Dashboard</h1>

            <p>
              Overview of the IDS Fintech Products Portal
            </p>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading">
            Loading dashboard...
          </div>
        ) : (
          <div className="stats-grid">

            <div className="stat-card">
              <span className="stat-label">
                Products
              </span>

              <strong>
                {counts.products}
              </strong>
            </div>

            <div className="stat-card">
              <span className="stat-label">
                Clients
              </span>

              <strong>
                {counts.clients}
              </strong>
            </div>

            <div className="stat-card">
              <span className="stat-label">
                Deployments
              </span>

              <strong>
                {counts.deployments}
              </strong>
            </div>

            <div className="stat-card">
              <span className="stat-label">
                Environments
              </span>

              <strong>
                {counts.environments}
              </strong>
            </div>

            <div className="stat-card">
              <span className="stat-label">
                Modules
              </span>

              <strong>
                {counts.modules}
              </strong>
            </div>

{isManager && (
  <div className="stat-card warning">
    <span className="stat-label">
      Pending Users
    </span>

    <strong>
      {counts.pendingUsers}
    </strong>
  </div>
)}

          </div>
        )}

        {isManager && (
          <section className="dashboard-welcome">

            <h2>
              Employee Approvals
            </h2>

            {loadingUsers ? (
              <div className="loading">
                Loading pending users...
              </div>
            ) : pendingUsers.length === 0 ? (
              <p>
                There are no pending employee accounts.
              </p>
            ) : (
              <div className="pending-users">

                {pendingUsers.map((user) => (
                  <div
                    key={user.id}
                    className="pending-user"
                  >

                    <div>
                      <strong>
                        {user.username}
                      </strong>

                      <div>
                        {user.email}
                      </div>

                      <small>
                        {user.roleName} · {user.status}
                      </small>
                    </div>

                    <button
                      className="primary-button"
                      onClick={() =>
                        handleApprove(user.id)
                      }
                    >
                      Approve
                    </button>

                  </div>
                ))}

              </div>
            )}

          </section>
        )}

        <section className="dashboard-welcome">

          <h2>
            Welcome to the Products Portal
          </h2>

          <p>
            Centralized access to IDS Fintech products,
            clients, deployments, environments and
            technical information.
          </p>

        </section>

      </main>
    </div>
  );
}

