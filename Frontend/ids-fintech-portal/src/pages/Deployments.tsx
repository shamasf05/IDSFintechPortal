import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import {
  createDeployment,
  deleteDeployment,
  getClients,
  getDeployments,
  getProducts,
} from "../services/api";

import type {
  Client,
  Deployment,
  Product,
} from "../types";

export default function Deployments() {
  const [deployments, setDeployments] =
    useState<Deployment[]>([]);

  const [clients, setClients] =
    useState<Client[]>([]);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [showForm, setShowForm] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [form, setForm] =
    useState<Partial<Deployment>>({
      clientId: undefined,
      productId: undefined,
      productVersion: "",
      goLiveDate: "",
      deploymentStatus: "Active",
      supportTier: "Standard",
      clientSpecificNotes: "",
    });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const [
        deploymentData,
        clientData,
        productData,
      ] = await Promise.all([
        getDeployments(),
        getClients(),
        getProducts(),
      ]);

      setDeployments(deploymentData);
      setClients(clientData);
      setProducts(productData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load deployments."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    field: keyof Deployment,
    value: string | number
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openCreateForm() {
    setForm({
      clientId: undefined,
      productId: undefined,
      productVersion: "",
      goLiveDate: "",
      deploymentStatus: "Active",
      supportTier: "Standard",
      clientSpecificNotes: "",
    });

    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!form.clientId || !form.productId) {
      setError(
        "Please select both a client and a product."
      );
      return;
    }

    try {
      await createDeployment(form);

      setShowForm(false);

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not create deployment."
      );
    }
  }

  async function handleDelete(id: number) {
    if (
      !window.confirm(
        "Are you sure you want to delete this deployment?"
      )
    ) {
      return;
    }

    try {
      await deleteDeployment(id);
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not delete deployment."
      );
    }
  }

  function getClientName(id: number) {
    return (
      clients.find(
        (client) => client.id === id
      )?.companyName || `Client #${id}`
    );
  }

  function getProductName(id: number) {
    return (
      products.find(
        (product) => product.id === id
      )?.name || `Product #${id}`
    );
  }

  return (
    <div className="app">
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <div>
            <h1>Deployments</h1>

            <p>
              Track products deployed for IDS Fintech
              clients.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={openCreateForm}
          >
            + Add Deployment
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {showForm && (
          <form
            className="form-card"
            onSubmit={handleSubmit}
          >
            <div className="form-header">
              <h2>Add Deployment</h2>

              <button
                type="button"
                className="close-button"
                onClick={() =>
                  setShowForm(false)
                }
              >
                Ã—
              </button>
            </div>

            <div className="form-grid">
              <div>
                <label>Client *</label>

                <select
                  value={form.clientId || ""}
                  onChange={(e) =>
                    handleChange(
                      "clientId",
                      Number(e.target.value)
                    )
                  }
                  required
                >
                  <option value="">
                    Select a client
                  </option>

                  {clients.map((client) => (
                    <option
                      key={client.id}
                      value={client.id}
                    >
                      {client.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Product *</label>

                <select
                  value={form.productId || ""}
                  onChange={(e) =>
                    handleChange(
                      "productId",
                      Number(e.target.value)
                    )
                  }
                  required
                >
                  <option value="">
                    Select a product
                  </option>

                  {products.map((product) => (
                    <option
                      key={product.id}
                      value={product.id}
                    >
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Product Version</label>

                <input
                  value={
                    form.productVersion || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "productVersion",
                      e.target.value
                    )
                  }
                  placeholder="e.g. 5.2.0"
                />
              </div>

              <div>
                <label>Go Live Date</label>

                <input
                  type="date"
                  value={
                    form.goLiveDate || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "goLiveDate",
                      e.target.value
                    )
                  }
                />
              </div>

              <div>
                <label>Deployment Status</label>

                <select
                  value={
                    form.deploymentStatus ||
                    "Active"
                  }
                  onChange={(e) =>
                    handleChange(
                      "deploymentStatus",
                      e.target.value
                    )
                  }
                >
                  <option>Active</option>
                  <option>Testing</option>
                  <option>Planned</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div>
                <label>Support Tier</label>

                <select
                  value={
                    form.supportTier ||
                    "Standard"
                  }
                  onChange={(e) =>
                    handleChange(
                      "supportTier",
                      e.target.value
                    )
                  }
                >
                  <option>Standard</option>
                  <option>Premium</option>
                  <option>Critical</option>
                </select>
              </div>

              <div className="full-column">
                <label>
                  Client-Specific Notes
                </label>

                <textarea
                  value={
                    form.clientSpecificNotes ||
                    ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "clientSpecificNotes",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  setShowForm(false)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
              >
                Create Deployment
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="loading">
            Loading deployments...
          </div>
        ) : deployments.length === 0 ? (
          <div className="empty-state">
            <h3>No deployments found</h3>

            <p>
              Add a deployment to connect a client
              with a product.
            </p>
          </div>
        ) : (
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Product</th>
                  <th>Version</th>
                  <th>Go Live</th>
                  <th>Status</th>
                  <th>Support</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {deployments.map(
                  (deployment) => (
                    <tr key={deployment.id}>
                      <td>
                        {getClientName(
                          deployment.clientId
                        )}
                      </td>

                      <td>
                        {getProductName(
                          deployment.productId
                        )}
                      </td>

                      <td>
                        {deployment.productVersion ||
                          "-"}
                      </td>

                      <td>
                        {deployment.goLiveDate ||
                          "-"}
                      </td>

                      <td>
                        <span className="badge">
                          {
                            deployment.deploymentStatus
                          }
                        </span>
                      </td>

                      <td>
                        {
                          deployment.supportTier
                        }
                      </td>

                      <td>
                        <button
                          className="small-button danger"
                          onClick={() =>
                            handleDelete(
                              deployment.id
                            )
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}