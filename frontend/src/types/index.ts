// === Concierge OS — TypeScript Types ===

export type ResidentStatus = "active" | "pending" | "inactive" | "suspended";
export type VisitorStatus = "active" | "frequent" | "pending" | "approved" | "checked-in" | "refused";
export type AuthorizationStatus = "pending" | "approved" | "refused" | "cancelled" | "expired";
export type VisitStatus = "awaiting" | "in_progress" | "completed" | "cancelled";
export type DeviceStatus = "in_use" | "available" | "maintenance" | "active" | "offline" | "idle" | "charging";
export type AlertSeverity = "critical" | "high" | "medium" | "low" | "warning" | "info" | "resolved";
export type UnitStatus = "occupied" | "vacant" | "maintenance" | "reserved";
export type CondoStatus = "active" | "inactive" | "maintenance" | "partial";

export interface Resident {
  id: string;
  name: string;
  initials?: string;
  company?: string;
  unit: string;
  block?: string;
  contact: string;
  phone?: string;
  email?: string;
  vip?: boolean;
  status: ResidentStatus;
  avatarUrl?: string;
}

export interface Visitor {
  id: string;
  name: string;
  document: string;
  nationality?: string;
  type: "guest" | "frequent_guest" | "service" | "delivery";
  company?: string;
  hostUnit?: string;
  hostResident?: string;
  lastVisit?: string;
  unitVisited?: string;
  visitHistory?: VisitHistoryEntry[];
  visitCount?: number;
  isFrequent?: boolean;
  notes?: string;
  status: VisitorStatus;
  avatarUrl?: string;
  initials: string;
}

export interface VisitHistoryEntry {
  date: string;
  unit: string;
}

export interface Authorization {
  id: string;
  visitorName: string;
  visitorInitials: string;
  visitorAvatar?: string;
  visitorCompany?: string;
  unit: string;
  hostUnit?: string;
  hostResident?: string;
  scheduledFor?: string;
  visitDate?: string;
  visitTime?: string;
  entryTime?: string;
  authorizedBy?: string;
  purpose?: string;
  status: AuthorizationStatus;
  reason?: string;
  type?: "guest" | "delivery" | "maintenance";
}

export interface ActiveVisit {
  id: string;
  name: string;
  initials?: string;
  visitorName?: string;
  type: "guest" | "maintenance" | "delivery";
  unit: string;
  hostUnit?: string;
  timeIn: string;
  checkInTime?: string;
  elapsed: string;
  location?: string;
  deviceId?: string;
}

export interface GpsDevice {
  id: string;
  deviceId: string;
  model: string;
  status: DeviceStatus;
  batteryLevel: number;
  battery?: number;
  lastSync: string;
  lastUpdate?: string;
  signal?: string;
  location?: string;
  assignedTo?: string;
  lat?: number;
  lng?: number;
}

export interface SecurityAlert {
  id: string;
  type: "restricted_area" | "low_battery" | "signal_lost" | "mechanical" | "perimeter";
  badge: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
  location?: string;
  cameraId?: string;
  assignedTo?: string;
  resolved?: boolean;
  timeline?: { time: string; event: string }[];
  status: "active" | "resolved";
}

export type AuditCategory = "auth" | "access" | "system" | "security" | "data";

export interface AuditEvent {
  id: string;
  timestamp: string;
  userInitials: string;
  userName: string;
  user?: string;
  action: string;
  actionType: "check_in" | "check_out" | "approved" | "refused" | "alert" | "package" | "valet";
  condoUnit: string;
  details: string;
  description?: string;
  category?: AuditCategory;
  ipAddress?: string;
}

export interface Condo {
  id: string;
  name: string;
  type: string;
  address: string;
  neighborhood: string;
  city?: string;
  unitCapacity: number;
  totalUnits?: number;
  occupiedUnits?: number;
  blocks?: number;
  residents?: number;
  status: CondoStatus;
}

export interface Block {
  id: string;
  name: string;
  fullName: string;
  totalUnits: number;
  floors?: number;
  status?: "active" | "planning";
  units: Unit[];
}

export interface Unit {
  id: string;
  number: string;
  status: UnitStatus;
  type?: "standard" | "penthouse" | "suite";
  resident?: string;
  floor?: number;
  note?: string;
  featured?: boolean;
}

export interface DashboardStat {
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  alert?: boolean;
}

export interface RecentMovement {
  id: string;
  name: string;
  type: "visitor" | "resident" | "service" | "delivery";
  badge?: string;
  destination: string;
  time: string;
  status: "entry" | "exit";
  avatarUrl?: string;
  initials: string;
}
