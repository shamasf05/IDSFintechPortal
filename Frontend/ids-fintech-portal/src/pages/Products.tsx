import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/api";

import type { Product } from "../types";

const emptyProduct: Partial<Product> = {
  name: "",
  description: "",
  businessPurpose: "",
  lifecycleStatus: "Active",
  currentVersion: "",
  supportedMarkets: "",
  criticality: "Medium",
  technologies: "",
  notes: "",
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [form, setForm] =
    useState<Partial<Product>>(emptyProduct);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);

      const data = await getProducts(search);

      setProducts(data);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load products."
      );
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyProduct);
    setShowForm(true);
  }

  function openEditForm(product: Product) {
    setEditingId(product.id);
    setForm(product);
    setShowForm(true);
  }

  function handleChange(
    field: keyof Product,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      if (!form.name) {
        setError("Product name is required.");
        return;
      }

      if (editingId) {
        await updateProduct(editingId, form);
      } else {
        await createProduct(form);
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyProduct);

      await loadProducts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not save product."
      );
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not delete product."
      );
    }
  }

  return (
    <div className="app">
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <div>
            <h1>Products</h1>
            <p>
              Manage IDS Fintech products and product
              information.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={openCreateForm}
          >
            + Add Product
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
                loadProducts();
              }
            }}
            placeholder="Search products..."
          />

          <button
            className="secondary-button"
            onClick={loadProducts}
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
                  ? "Edit Product"
                  : "Add Product"}
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
                <label>Name *</label>

                <input
                  value={form.name || ""}
                  onChange={(e) =>
                    handleChange(
                      "name",
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div>
                <label>Current Version</label>

                <input
                  value={
                    form.currentVersion || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "currentVersion",
                      e.target.value
                    )
                  }
                  placeholder="e.g. 5.2.0"
                />
              </div>

              <div>
                <label>Lifecycle Status</label>

                <select
                  value={
                    form.lifecycleStatus || "Active"
                  }
                  onChange={(e) =>
                    handleChange(
                      "lifecycleStatus",
                      e.target.value
                    )
                  }
                >
                  <option>Active</option>
                  <option>Development</option>
                  <option>Maintenance</option>
                  <option>Deprecated</option>
                </select>
              </div>

              <div>
                <label>Criticality</label>

                <select
                  value={
                    form.criticality || "Medium"
                  }
                  onChange={(e) =>
                    handleChange(
                      "criticality",
                      e.target.value
                    )
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>

              <div>
                <label>Supported Markets</label>

                <input
                  value={
                    form.supportedMarkets || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "supportedMarkets",
                      e.target.value
                    )
                  }
                  placeholder="Lebanon, GCC..."
                />
              </div>

              <div>
                <label>Technologies</label>

                <input
                  value={
                    form.technologies || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "technologies",
                      e.target.value
                    )
                  }
                  placeholder=".NET, React, SQL..."
                />
              </div>

              <div className="full-column">
                <label>Description</label>

                <textarea
                  value={
                    form.description || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "description",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="full-column">
                <label>Business Purpose</label>

                <textarea
                  value={
                    form.businessPurpose || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "businessPurpose",
                      e.target.value
                    )
                  }
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
                  : "Create Product"}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="loading">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>No products found</h3>
            <p>
              Add your first product to the portal.
            </p>
          </div>
        ) : (
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Version</th>
                  <th>Status</th>
                  <th>Criticality</th>
                  <th>Technologies</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <Link
                        className="table-link"
                        to={`/products/${product.id}`}
                      >
                        {product.name}
                      </Link>
                    </td>

                    <td>
                      {product.currentVersion ||
                        "-"}
                    </td>

                    <td>
                      <span className="badge">
                        {
                          product.lifecycleStatus
                        }
                      </span>
                    </td>

                    <td>
                      {product.criticality ||
                        "-"}
                    </td>

                    <td>
                      {product.technologies ||
                        "-"}
                    </td>

                    <td>
                      <div className="table-actions">
                        <Link
                          className="small-button"
                          to={`/products/${product.id}`}
                        >
                          View
                        </Link>

                        <button
                          className="small-button"
                          onClick={() =>
                            openEditForm(product)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="small-button danger"
                          onClick={() =>
                            handleDelete(
                              product.id
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