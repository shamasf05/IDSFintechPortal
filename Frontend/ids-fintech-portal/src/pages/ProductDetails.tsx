import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";

import {
  getModules,
  getProduct,
  getProductResponsibilities,
  getTeamMembers,
  createProductResponsibility,
  deleteProductResponsibility,
} from "../services/api";

import type {
  Module,
  Product,
  ProductResponsibility,
  TeamMember,
} from "../types";

export default function ProductDetails() {    
  const { id } = useParams();

const role = localStorage.getItem("role");

const canManageResponsibilities =
  role === "CEO" || role === "Manager";

  const [product, setProduct] =
    useState<Product | null>(null);

  const [modules, setModules] =
    useState<Module[]>([]);

  const [responsibilities, setResponsibilities] =
    useState<ProductResponsibility[]>([]);

  const [teamMembers, setTeamMembers] =
    useState<TeamMember[]>([]);

  const [selectedTeamMember, setSelectedTeamMember] =
    useState("");

  const [responsibility, setResponsibility] =
    useState("");

  const [responsibilityDescription, setResponsibilityDescription] =
    useState("");

  const [assigning, setAssigning] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (id) {
      loadProduct(Number(id));
    }
  }, [id]);

  async function loadProduct(productId: number) {
    try {
      setLoading(true);
      setError("");

      const [
        productData,
        moduleData,
        responsibilityData,
        teamMemberData,
      ] = await Promise.all([
        getProduct(productId),
        getModules(productId),
        getProductResponsibilities(productId),
        getTeamMembers(),
      ]);

      setProduct(productData);
      setModules(moduleData);
      setResponsibilities(responsibilityData ?? []);
      setTeamMembers(teamMemberData ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load product."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleAssignTeamMember() {
    if (!id) {
      return;
    }

    if (!selectedTeamMember) {
      alert("Please select a team member.");
      return;
    }

    if (!responsibility.trim()) {
      alert("Please enter the responsibility.");
      return;
    }

    try {
      setAssigning(true);

      await createProductResponsibility({
        productId: Number(id),
        teamMemberId: Number(selectedTeamMember),
        responsibility: responsibility.trim(),
        description:
          responsibilityDescription.trim() || undefined,
      });

      setSelectedTeamMember("");
      setResponsibility("");
      setResponsibilityDescription("");

      const updatedResponsibilities =
        await getProductResponsibilities(Number(id));

      setResponsibilities(updatedResponsibilities ?? []);
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Could not assign team member."
      );
    } finally {
      setAssigning(false);
    }
  }

  async function handleRemoveTeamMember(
    responsibilityId: number
  ) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this team member from the product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProductResponsibility(
        responsibilityId
      );

      setResponsibilities((current) =>
        current.filter(
          (item) => item.id !== responsibilityId
        )
      );
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Could not remove team member."
      );
    }
  }

  if (loading) {
    return (
      <div className="app">
        <Navbar />

        <main className="page-container">
          <div className="loading">
            Loading product...
          </div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="app">
        <Navbar />

        <main className="page-container">
          <div className="error-message">
            {error || "Product not found."}
          </div>

          <Link
            className="secondary-button"
            to="/products"
          >
            Back to Products
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar />

      <main className="page-container">

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/products">
            Products
          </Link>

          <span>/</span>

          <span>{product.name}</span>
        </div>

        {/* Header */}
        <div className="page-header">
          <div>
            <h1>{product.name}</h1>

            <p>
              Product information and technical details
            </p>
          </div>

          <div className="detail-badges">
            <span className="badge">
              {product.lifecycleStatus}
            </span>

            {product.criticality && (
              <span className="badge">
                {product.criticality}
              </span>
            )}
          </div>
        </div>

        <div className="details-grid">

          {/* Basic Information */}
          <section className="detail-card">
            <h2>Basic Information</h2>

            <div className="detail-row">
              <span>Current Version</span>
              <strong>
                {product.currentVersion || "-"}
              </strong>
            </div>

            <div className="detail-row">
              <span>Lifecycle Status</span>
              <strong>
                {product.lifecycleStatus || "-"}
              </strong>
            </div>

            <div className="detail-row">
              <span>Criticality</span>
              <strong>
                {product.criticality || "-"}
              </strong>
            </div>

            <div className="detail-row">
              <span>Supported Markets</span>
              <strong>
                {product.supportedMarkets || "-"}
              </strong>
            </div>

            <div className="detail-row">
              <span>Technologies</span>
              <strong>
                {product.technologies || "-"}
              </strong>
            </div>
          </section>

          {/* Business Purpose */}
          <section className="detail-card">
            <h2>Business Purpose</h2>

            <p>
              {product.businessPurpose ||
                "No business purpose has been added."}
            </p>
          </section>

          {/* Description */}
          <section className="detail-card full-width-card">
            <h2>Description</h2>

            <p>
              {product.description ||
                "No description has been added."}
            </p>
          </section>

          {/* Modules */}
          <section className="detail-card full-width-card">
            <h2>Modules</h2>

            {modules.length === 0 ? (
              <div className="empty-small">
                No modules have been added.
              </div>
            ) : (
              <div className="module-grid">
                {modules.map((module) => (
                  <div
                    className="module-card"
                    key={module.id}
                  >
                    <h3>{module.name}</h3>

                    <p>
                      {module.description ||
                        "No description."}
                    </p>

                    {module.status && (
                      <span className="badge">
                        {module.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Responsible Team */}
<section className="detail-card full-width-card">

  <h2>Responsible Team</h2>

  {responsibilities.length === 0 ? (
    <div className="empty-small">
      No responsible team members have been assigned.
    </div>
  ) : (
    <div className="team-grid">

      {responsibilities.map(
        (responsibilityItem) => (
          <div
            className="team-member-card"
            key={responsibilityItem.id}
          >

            <div className="team-member-content">

              <h3>
                {responsibilityItem.teamMemberName ||
                  "Unknown Team Member"}
              </h3>

              <p>
                {responsibilityItem.jobTitle || "-"}
              </p>

              <p>
                {responsibilityItem.department || "-"}
              </p>

              {responsibilityItem.email && (
                <p>
                  {responsibilityItem.email}
                </p>
              )}

              {responsibilityItem.responsibility && (
                <span className="badge">
                  {responsibilityItem.responsibility}
                </span>
              )}

              {responsibilityItem.description && (
                <p>
                  {responsibilityItem.description}
                </p>
              )}

            </div>

            {canManageResponsibilities && (
              <button
                type="button"
                className="danger-button"
                onClick={() =>
                  handleRemoveTeamMember(
                    responsibilityItem.id
                  )
                }
              >
                Remove
              </button>
            )}

          </div>
        )
      )}

    </div>
  )}

  {canManageResponsibilities && (
    <div className="assign-team-section">

      <h3>
        Assign Team Member
      </h3>

      <div className="assign-team-form">

        <div className="form-group">
          <label htmlFor="teamMember">
            Team Member
          </label>

          <select
            id="teamMember"
            value={selectedTeamMember}
            onChange={(e) =>
              setSelectedTeamMember(e.target.value)
            }
          >
            <option value="">
              Select a team member
            </option>

            {teamMembers.map((member) => (
              <option
                key={member.id}
                value={member.id}
              >
                {member.fullName}
                {member.jobTitle
                  ? ` - ${member.jobTitle}`
                  : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="responsibility">
            Responsibility
          </label>

          <input
            id="responsibility"
            type="text"
            value={responsibility}
            onChange={(e) =>
              setResponsibility(e.target.value)
            }
            placeholder="e.g. Backend Developer"
          />
        </div>

        <div className="form-group">
          <label htmlFor="responsibilityDescription">
            Description
          </label>

          <textarea
            id="responsibilityDescription"
            value={responsibilityDescription}
            onChange={(e) =>
              setResponsibilityDescription(
                e.target.value
              )
            }
            placeholder="Describe this team member's responsibility..."
            rows={3}
          />
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={handleAssignTeamMember}
          disabled={assigning}
        >
          {assigning
            ? "Assigning..."
            : "Assign Team Member"}
        </button>

      </div>

    </div>
  )}

</section>

          {/* Notes */}
          <section className="detail-card full-width-card">

            <h2>Notes</h2>

            <p>
              {product.notes ||
                "No notes have been added."}
            </p>

          </section>

        </div>
      </main>
    </div>
  );
}