import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import {
  createClient,
  deleteClient,
  getClients,
  updateClient,
} from "../services/api";

import type { Client } from "../types";

const emptyClient: Partial<Client> = {
  companyName: "",
  country: "",
  contactInformation: "",
  status: "Active",
  notes: "",
};

export default function Clients() {
  const [clients, setClients] =
    useState<Client[]>([]);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [form, setForm] =
    useState<Partial<Client>>(emptyClient);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      setLoading(true);

      const data = await getClients(search);

      setClients(data);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load clients."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    field: keyof Client,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyClient);
    setShowForm(true);
  }

  function openEditForm(client: Client) {
    setEditingId(client.id);
    setForm(client);
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!form.companyName) {
      setError("Company name is required.");
      return;
    }

    try {
      if (editingId) {
        await updateClient(editingId, form);
      } else {
        await createClient(form);
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyClient);

      await loadClients();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not save client."
      );
    }
  }

  async function handleDelete(id: number) {
    if (
      !window.confirm(
        "Are you sure you want to delete this client?"
      )
    ) {
      return;
    }

    try {
      await deleteClient(id);
      await loadClients();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not delete client."
      );
    }
  }

  return (
    <div className="app">
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <div>
            <h1>Clients</h1>
            <p>
              Manage IDS Fintech client organizations.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={openCreateForm}
          >
            + Add Client
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="search-bar">
          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                loadClients();
              }
            }}
            placeholder="Search clients..."
          />

          <button
            className="secondary-button"
            onClick={loadClients}
          >
            Search
          </button>
        </div>

        {showForm && (
          <form
            className="form-card"
            onSubmit={handleSubmit}
          >
            <div className="form-header">
              <h2>
                {editingId
                  ? "Edit Client"
                  : "Add Client"}
              </h2>

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
                <label>Company Name *</label>

                <input
                  value={
                    form.companyName || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "companyName",
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div>
                <label>Country</label>

                <input
                  value={form.country || ""}
                  onChange={(e) =>
                    handleChange(
                      "country",
                      e.target.value
                    )
                  }
                />
              </div>

              <div>
                <label>Status</label>

                <select
                  value={
                    form.status || "Active"
                  }
                  onChange={(e) =>
                    handleChange(
                      "status",
                      e.target.value
                    )
                  }
                >
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Prospect</option>
                </select>
              </div>

              <div>
                <label>
                  Contact Information
                </label>

                <input
                  value={
                    form.contactInformation ||
                    ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "contactInformation",
                      e.target.value
                    )
                  }
                  placeholder="Email, phone..."
                />
              </div>

              <div className="full-column">
                <label>Notes</label>

                <textarea
                  value={form.notes || ""}
                  onChange={(e) =>
                    handleChange(
                      "notes",
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
                {editingId
                  ? "Save Changes"
                  : "Create Client"}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="loading">
            Loading clients...
          </div>
        ) : clients.length === 0 ? (
          <div className="empty-state">
            <h3>No clients found</h3>
            <p>
              Add your first client to the portal.
            </p>
          </div>
        ) : (
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Country</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <strong>
                        {client.companyName}
                      </strong>
                    </td>

                    <td>
                      {client.country || "-"}
                    </td>

                    <td>
                      {client.contactInformation ||
                        "-"}
                    </td>

                    <td>
                      <span className="badge">
                        {client.status ||
                          "Unknown"}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          className="small-button"
                          onClick={() =>
                            openEditForm(client)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="small-button danger"
                          onClick={() =>
                            handleDelete(
                              client.id
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}