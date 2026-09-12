export interface User { id: number; username: string; email: string; roleId: number; roleName: string; status: string; }
export interface LoginResponse { message: string; data: { token: string; user: User; }; }
export interface Product { id: number; name: string; description?: string; businessPurpose?: string; lifecycleStatus: string; currentVersion?: string; supportedMarkets?: string; criticality?: string; technologies?: string; notes?: string; createdAt?: string; updatedAt?: string; }
export interface Module { id: number; productId: number; name: string; description?: string; status?: string; }
export interface Client { id: number; companyName: string; country?: string; contactInformation?: string; status?: string; notes?: string; createdAt?: string; }
export interface Deployment { id: number; clientId: number; productId: number; productVersion?: string; goLiveDate?: string; deploymentStatus?: string; supportTier?: string; clientSpecificNotes?: string; clientName?: string; productName?: string; }
export interface Environment { id: number; deploymentId: number; name: string; environmentType?: string; purpose?: string; serverName?: string; operatingSystem?: string; applicationUrl?: string; databaseInformation?: string; monitoringLink?: string; accessInstructions?: string; notes?: string; }
export interface DashboardSummary { products: number; clients: number; deployments: number; teamMembers: number; modules: number; pendingUsers: number; }
export type PendingUser = {
  id: number;
  username: string;
  email: string;
  roleName: string;
  status: string;
  createdAt: string;
};
export interface ManagedUser { id: number; username: string; email: string; roleId?: number; roleName: string; status: string; createdAt: string; approvedAt?: string; approvedBy?: number; }
export interface TeamMember {
    id: number;
    fullName: string;
    jobTitle?: string;
    department?: string;
    email?: string;
    status?: string;
}

export interface ProductResponsibility {
    id: number;
    productId: number;
    teamMemberId: number;
    responsibility?: string;
    description?: string;
    teamMemberName?: string;
    jobTitle?: string;
    department?: string;
    email?: string;
}

export interface DeploymentModule {
    deploymentId: number;
    moduleId: number;
    moduleName: string;
    description?: string;
    status?: string;
    enabled: boolean;
}

