import { useEffect, useState } from "react";
import { approveUser, getPendingUsers, getUsers, rejectUser } from "../services/api";
import Navbar from "../components/Navbar";
import type { ManagedUser } from "../types";

export default function Users() {
  const isCeo = localStorage.getItem("role") === "CEO";
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [error, setError] = useState("");

  const load = async () => {
    try { setUsers(isCeo ? await getUsers() : await getPendingUsers()); setError(""); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not load users."); }
  };
  useEffect(() => { void load(); }, [isCeo]);

  const action = async (id: number, approve: boolean) => {
    try { if (approve) await approveUser(id); else await rejectUser(id); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not update employee."); }
  };

  return <div className="app"><Navbar /><main className="page-container">
    <div className="page-header"><div><h1>{isCeo ? "User Management" : "Employee Approvals"}</h1><p>{isCeo ? "Manage employee accounts." : "Approve or reject pending employee accounts."}</p></div></div>
    {error && <div className="error-message">{error}</div>}
    <div className="table-card"><table><thead><tr><th>Username</th><th>Email</th><th>Role</th><th>Status</th><th>Created</th>{!isCeo && <th>Actions</th>}</tr></thead><tbody>
      {users.map(user => <tr key={user.id}><td><strong>{user.username}</strong></td><td>{user.email}</td><td><span className="badge">{user.roleName}</span></td><td>{user.status}</td><td>{new Date(user.createdAt).toLocaleDateString()}</td>{!isCeo && <td><div className="table-actions"><button className="small-button" onClick={() => action(user.id, true)}>Approve</button><button className="small-button danger" onClick={() => action(user.id, false)}>Reject</button></div></td>}</tr>)}
    </tbody></table></div>
    {!users.length && <div className="empty-state"><h3>No users found</h3><p>{isCeo ? "There are no registered users." : "There are no pending employee accounts."}</p></div>}
  </main></div>;
}
