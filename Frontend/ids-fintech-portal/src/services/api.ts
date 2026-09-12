import type {
  Client,
  DashboardSummary,
  Deployment,
  Environment,
  LoginResponse,
  Module,
  Product,
  PendingUser,
  ManagedUser,
  TeamMember,
  ProductResponsibility
} from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5022/api";
type ApiResponse<T> = { message: string; data: T };

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = { "Content-Type": "application/json", ...options.headers };
  if (token) (headers as Record<string, string>).Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  if (!response.ok) {
    const text = await response.text();
    try { throw new Error(JSON.parse(text).message ?? "Request failed."); }
    catch (error) { if (error instanceof Error && error.message !== "Request failed.") throw error; throw new Error(text || "Request failed."); }
  }
  return response.status === 204 ? undefined as T : response.json() as Promise<T>;
}
const data = async <T>(endpoint: string, options?: RequestInit) => (await request<ApiResponse<T>>(endpoint, options)).data;

export const login = (username: string, password: string) => request<LoginResponse>("/Auth/login", { method: "POST", body: JSON.stringify({ username, password }) });
export const register = (username: string, email: string, password: string) => request<{ message: string }>("/Auth/register", { method: "POST", body: JSON.stringify({ username, email, password }) });

export const getDashboardSummary = () => data<DashboardSummary>("/Dashboard/summary");
export const getProducts = (search = "") => data<Product[]>(`/Products${search ? `?search=${encodeURIComponent(search)}` : ""}`);
export const getProduct = (id: number) => data<Product>(`/Products/${id}`);
export const createProduct = (product: Partial<Product>) => request("/Products", { method: "POST", body: JSON.stringify(product) });
export const updateProduct = (id: number, product: Partial<Product>) => request(`/Products/${id}`, { method: "PUT", body: JSON.stringify(product) });
export const deleteProduct = (id: number) => request<void>(`/Products/${id}`, { method: "DELETE" });

export const getModules = (productId?: number) => data<Module[]>(`/Modules${productId === undefined ? "" : `?productId=${productId}`}`);
export const getClients = (search = "") => data<Client[]>(`/Clients${search ? `?search=${encodeURIComponent(search)}` : ""}`);
export const getClient = (id: number) => data<Client>(`/Clients/${id}`);
export const createClient = (client: Partial<Client>) => request("/Clients", { method: "POST", body: JSON.stringify(client) });
export const updateClient = (id: number, client: Partial<Client>) => request(`/Clients/${id}`, { method: "PUT", body: JSON.stringify(client) });
export const deleteClient = (id: number) => request<void>(`/Clients/${id}`, { method: "DELETE" });

export const getDeployments = (clientId?: number, productId?: number) => { const q = new URLSearchParams(); if (clientId) q.set("clientId", String(clientId)); if (productId) q.set("productId", String(productId)); return data<Deployment[]>(`/Deployments${q.size ? `?${q}` : ""}`); };
export const createDeployment = (item: Partial<Deployment>) => request("/Deployments", { method: "POST", body: JSON.stringify(item) });
export const updateDeployment = (id: number, item: Partial<Deployment>) => request(`/Deployments/${id}`, { method: "PUT", body: JSON.stringify(item) });
export const deleteDeployment = (id: number) => request<void>(`/Deployments/${id}`, { method: "DELETE" });

export const getEnvironments = (deploymentId?: number) => data<Environment[]>(`/Environments${deploymentId === undefined ? "" : `?deploymentId=${deploymentId}`}`);
export const getEnvironment = (id: number) => data<Environment>(`/Environments/${id}`);
export const createEnvironment = (item: Partial<Environment>) => request("/Environments", { method: "POST", body: JSON.stringify(item) });
export const updateEnvironment = (id: number, item: Partial<Environment>) => request(`/Environments/${id}`, { method: "PUT", body: JSON.stringify(item) });
export const deleteEnvironment = (id: number) => request<void>(`/Environments/${id}`, { method: "DELETE" });

export const getPendingUsers = () =>
  data<PendingUser[]>("/Users/pending");

export const approveUser = (id: number) =>
  request<{ message: string }>(`/Users/${id}/approve`, {
    method: "PUT",
  });
export const getUsers = () => data<ManagedUser[]>("/Users");
export const rejectUser = (id: number) => request<{ message: string }>(`/Users/${id}/reject`, { method: "PUT" });


export const getTeamMembers = () =>
  request<TeamMember[]>("/TeamMembers");

export const getProductResponsibilities = (productId: number) =>
  request<ProductResponsibility[]>(
    `/ProductResponsibilities/product/${productId}`
  );

export const createProductResponsibility = (
  responsibility: Partial<ProductResponsibility>
) =>
  request("/ProductResponsibilities", {
    method: "POST",
    body: JSON.stringify(responsibility),
  });

export const deleteProductResponsibility = (id: number) =>
  request<void>(`/ProductResponsibilities/${id}`, {
    method: "DELETE",
  });
