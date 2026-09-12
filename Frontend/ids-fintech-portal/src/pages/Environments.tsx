import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { createEnvironment, deleteEnvironment, getDeployments, getEnvironments, updateEnvironment } from "../services/api";
import Navbar from "../components/Navbar";
import type { Deployment, Environment } from "../types";

const blank: Partial<Environment> = { deploymentId: undefined, name: "", environmentType: "Production", purpose: "", serverName: "", operatingSystem: "", applicationUrl: "", databaseInformation: "", monitoringLink: "", accessInstructions: "", notes: "" };

export default function Environments() {
  const [items, setItems] = useState<Environment[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [form, setForm] = useState<Partial<Environment>>(blank);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try { setLoading(true); const [environments, deploymentData] = await Promise.all([getEnvironments(), getDeployments()]); setItems(environments); setDeployments(deploymentData); setError(""); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not load environments."); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const change = (field: keyof Environment, value: string | number) => setForm(current => ({ ...current, [field]: value }));
  const create = () => { setEditingId(null); setForm(blank); setShowForm(true); };
  const edit = (item: Environment) => { setEditingId(item.id); setForm(item); setShowForm(true); };
const deploymentLabel = (id: number) => {
  const d = deployments.find(x => x.id === id);
  return d ? `${d.clientName} · ${d.productName}` : `Deployment #${id}`;
};

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.deploymentId || !form.name?.trim()) { setError("Deployment and environment name are required."); return; }
    try { if (editingId) await updateEnvironment(editingId, form); else await createEnvironment(form); setShowForm(false); setEditingId(null); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not save environment."); }
  }
  async function remove(id: number) {
    if (!window.confirm("Delete this environment?")) return;
    try { await deleteEnvironment(id); await load(); } catch (e) { setError(e instanceof Error ? e.message : "Could not delete environment."); }
  }

  return <div className="app"><Navbar /><main className="page-container">
    <div className="page-header"><div><h1>Environments</h1><p>Manage deployment infrastructure, access and monitoring details.</p></div><button className="primary-button" onClick={create}>+ Add Environment</button></div>
    {error && <div className="error-message">{error}</div>}
    {showForm && <form className="form-card" onSubmit={submit}><div className="form-header"><h2>{editingId ? "Edit Environment" : "Add Environment"}</h2><button type="button" className="close-button" onClick={() => setShowForm(false)}>×</button></div>
      <div className="form-grid">
        <div><label>Deployment *</label><select value={form.deploymentId ?? ""} onChange={e => change("deploymentId", Number(e.target.value))} required><option value="">Select a deployment</option>{deployments.map(d => <option key={d.id} value={d.id}>{deploymentLabel(d.id)}</option>)}</select></div>
        <div><label>Name *</label><input value={form.name ?? ""} onChange={e => change("name", e.target.value)} required placeholder="e.g. Production" /></div>
        <div><label>Environment Type</label><select value={form.environmentType ?? ""} onChange={e => change("environmentType", e.target.value)}><option>Production</option><option>Staging</option><option>Testing</option><option>Development</option></select></div>
        <div><label>Purpose</label><input value={form.purpose ?? ""} onChange={e => change("purpose", e.target.value)} /></div>
        <div><label>Server Name</label><input value={form.serverName ?? ""} onChange={e => change("serverName", e.target.value)} /></div>
        <div><label>Operating System</label><input value={form.operatingSystem ?? ""} onChange={e => change("operatingSystem", e.target.value)} /></div>
        <div><label>Application URL</label><input type="url" value={form.applicationUrl ?? ""} onChange={e => change("applicationUrl", e.target.value)} /></div>
        <div><label>Monitoring Link</label><input type="url" value={form.monitoringLink ?? ""} onChange={e => change("monitoringLink", e.target.value)} /></div>
        <div className="full-column"><label>Database Information</label><input value={form.databaseInformation ?? ""} onChange={e => change("databaseInformation", e.target.value)} /></div>
        <div className="full-column"><label>Access Instructions</label><textarea value={form.accessInstructions ?? ""} onChange={e => change("accessInstructions", e.target.value)} /></div>
        <div className="full-column"><label>Notes</label><textarea value={form.notes ?? ""} onChange={e => change("notes", e.target.value)} /></div>
      </div><div className="form-actions"><button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button><button className="primary-button" type="submit">{editingId ? "Save Changes" : "Create Environment"}</button></div>
    </form>}
    {loading ? <div className="loading">Loading environments...</div> : items.length === 0 ? <div className="empty-state"><h3>No environments found</h3><p>Add an environment to document infrastructure for a deployment.</p></div> : <div className="table-card"><table><thead><tr><th>Name</th><th>Deployment</th><th>Type</th><th>Server</th><th>Application URL</th><th>Actions</th></tr></thead><tbody>{items.map(item => <tr key={item.id}><td><strong>{item.name}</strong></td><td>{deploymentLabel(item.deploymentId)}</td><td><span className="badge">{item.environmentType || "-"}</span></td><td>{item.serverName || "-"}</td><td>{item.applicationUrl ? <a className="table-link" href={item.applicationUrl} target="_blank" rel="noreferrer">Open</a> : "-"}</td><td><div className="table-actions"><button className="small-button" onClick={() => edit(item)}>Edit</button><button className="small-button danger" onClick={() => remove(item.id)}>Delete</button></div></td></tr>)}</tbody></table></div>}
  </main></div>;
}
