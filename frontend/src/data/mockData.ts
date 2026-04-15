// === Concierge OS — Mock Data ===
import type {
  Resident,
  Visitor,
  Authorization,
  ActiveVisit,
  GpsDevice,
  SecurityAlert,
  AuditEvent,
  Condo,
  Block,
  DashboardStat,
  RecentMovement,
} from "@/types";

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const mockDashboardStats: DashboardStat[] = [
  { label: "Active Visitors", value: 14, trend: "+3 since 6PM", trendUp: true },
  { label: "Pending Invites", value: 8, trend: "Awaiting clearance: 4" },
  { label: "Active Alerts", value: 2, trend: "Service Elevator A Jammed", alert: true },
  { label: "GPS Devices Available", value: 42, trend: "85% inventory efficiency" },
];

export const mockRecentMovements: RecentMovement[] = [
  { id: "1", name: "Julianne DeSilva", type: "visitor", badge: "Visitor • Pass #8540", destination: "Unit 1402 (Sky Loft)", time: "19:42 PM", status: "entry", initials: "JD" },
  { id: "2", name: "Dr. Elias Vance", type: "resident", badge: "Resident • Unit 0402", destination: "Valet Concierge", time: "19:28 PM", status: "exit", initials: "EV" },
  { id: "3", name: "Seamless Delivery", type: "delivery", badge: "Service • Courier #99", destination: "Mail Room", time: "19:15 PM", status: "entry", initials: "SD" },
  { id: "4", name: "Sarah Jenkins", type: "visitor", badge: "Guest • Unit 2201", destination: "Rooftop Lounge", time: "18:55 PM", status: "entry", initials: "SJ" },
];

// ─── Residents ────────────────────────────────────────────────────────────────

export const mockResidents: Resident[] = [
  { id: "r1", name: "Alexandra Vance", company: "Vance Design Group", unit: "402-A", contact: "+1 (555) 092-1283", status: "active" },
  { id: "r2", name: "Julian Thorne", company: "Private Equity Partner", unit: "Penthouse B", contact: "+1 (555) 882-0192", status: "active" },
  { id: "r3", name: "Evelyn Sterling", company: "Independent Curator", unit: "812", contact: "+1 (555) 341-9920", status: "pending" },
  { id: "r4", name: "Marcus Holloway", company: "CTO, Veridian", unit: "1204", contact: "+1 (555) 772-0012", status: "active" },
  { id: "r5", name: "Diana Forsythe", company: "Forsythe Capital", unit: "701", contact: "+1 (555) 447-3391", status: "active" },
  { id: "r6", name: "Nico Castillo", company: "Architect", unit: "305", contact: "+1 (555) 601-9827", status: "active" },
];

// ─── Visitors ─────────────────────────────────────────────────────────────────

export const mockVisitors: Visitor[] = [
  {
    id: "v1", name: "Alessandro Moretti", document: "ID-98234-X", nationality: "Italy",
    type: "guest", lastVisit: "Oct 24, 2023 • 14:27 PM", unitVisited: "Penthouse A",
    visitHistory: [{ date: "Oct 24, 2023", unit: "Penthouse A" }, { date: "Sep 12, 2023", unit: "Penthouse A" }],
    status: "active", initials: "AM",
  },
  {
    id: "v2", name: "Julianne Smith", document: "ID-11002-L", nationality: "USA",
    type: "frequent_guest", lastVisit: "Oct 25, 2023 • 09:15 AM", unitVisited: "1204",
    visitHistory: [{ date: "Oct 25, 2023", unit: "Unit 1204" }, { date: "Oct 22, 2023", unit: "Unit 1204" }, { date: "Oct 19, 2023", unit: "Unit 1204" }],
    status: "frequent", initials: "JS",
  },
  {
    id: "v3", name: "Robert Miller", document: "TX-44512-9", nationality: "USA",
    type: "service", lastVisit: "Oct 23, 2023 • 11:00 AM", unitVisited: "802",
    visitHistory: [{ date: "Oct 23, 2023", unit: "Unit 802" }],
    status: "active", initials: "RM",
  },
  {
    id: "v4", name: "Elena Huang", document: "ID-77281-W", nationality: "Canada",
    type: "guest", lastVisit: "Oct 21, 2023 • 18:45 PM", unitVisited: "1402",
    visitHistory: [{ date: "Oct 21, 2023", unit: "Unit 1402" }],
    status: "active", initials: "EH",
  },
];

// ─── Authorizations ───────────────────────────────────────────────────────────

export const mockAuthorizations: Authorization[] = [
  { id: "a1", visitorName: "Elena Rodriguez", visitorInitials: "ER", unit: "Unit 402", scheduledFor: "14:30 Today", status: "pending", type: "guest" },
  { id: "a2", visitorName: "Amazon Logistics", visitorInitials: "AL", unit: "Service Entrance", entryTime: "11:15 AM", status: "approved", type: "delivery" },
  { id: "a3", visitorName: "Julian Vane", visitorInitials: "JV", unit: "Unit 1005", status: "refused", type: "guest", reason: "Security Flag: Unverified ID" },
  { id: "a4", visitorName: "Marcus Thorne", visitorInitials: "MT", unit: "Penthouse A", scheduledFor: "13:00 Today", status: "pending", type: "maintenance" },
  { id: "a5", visitorName: "Sarah Jenkins", visitorInitials: "SJ", unit: "Unit 2201", scheduledFor: "09:00 Today", status: "approved", type: "guest" },
  { id: "a6", visitorName: "FedEx Express", visitorInitials: "FE", unit: "PH-1202", entryTime: "14:22", status: "approved", type: "delivery" },
];

// ─── Active Visits (Portaria) ─────────────────────────────────────────────────

export const mockActiveVisits: ActiveVisit[] = [
  { id: "av1", name: "Marcus Thompson", type: "guest", unit: "Unit 805", timeIn: "13:12", elapsed: "1h 12m", deviceId: "OBX-9942" },
  { id: "av2", name: "TechServ Solutions", type: "maintenance", unit: "ROOF", timeIn: "13:39", elapsed: "0h 45m", deviceId: "OBX-8721" },
  { id: "av3", name: "Amazon Prime", type: "delivery", unit: "LOBBY", timeIn: "14:20", elapsed: "0h 04m" },
];

// ─── GPS Devices ──────────────────────────────────────────────────────────────

export const mockDevices: GpsDevice[] = [
  { id: "d1", deviceId: "OBX-9942", model: "Ultra-Narrowband V4", status: "in_use", batteryLevel: 88, lastSync: "2 mins ago", location: "Suite 1201 • Yield A", assignedTo: "Marcus Thompson", lat: -23.55052, lng: -46.63308 },
  { id: "d2", deviceId: "OBX-8721", model: "Asset Tag Mini", status: "available", batteryLevel: 100, lastSync: "14 hours ago", location: "Storage Locker B" },
  { id: "d3", deviceId: "OBX-4412", model: "Standard Hub", status: "in_use", batteryLevel: 14, lastSync: "Active", location: "Penthouse 2 • Elevator C", assignedTo: "TechServ Solutions", lat: -23.55112, lng: -46.63412 },
  { id: "d4", deviceId: "OBX-1120", model: "Nano-Tag V1", status: "maintenance", batteryLevel: 0, lastSync: "3 days ago", location: "Service Desk" },
  { id: "d5", deviceId: "OBX-0312", model: "Ultra-Narrowband V4", status: "available", batteryLevel: 97, lastSync: "6 hours ago", location: "Storage Locker A" },
  { id: "d6", deviceId: "OBX-7755", model: "Standard Hub", status: "in_use", batteryLevel: 61, lastSync: "5 mins ago", location: "Unit 402", assignedTo: "Elena Rodriguez", lat: -23.54900, lng: -46.63100 },
];

// ─── Security Alerts ──────────────────────────────────────────────────────────

export const mockAlerts: SecurityAlert[] = [
  {
    id: "al1", type: "perimeter", badge: "RESTRICTED AREA", title: "Zone 04: Perimeter Breach",
    description: "Unauthorized access detected at North Loading Dock. Door 12-B sensor tripped.",
    severity: "critical", timestamp: "2m ago", location: "North Loading Dock", cameraId: "NC-402", status: "active",
  },
  {
    id: "al2", type: "low_battery", badge: "LOW BATTERY", title: "Lift A: Backup Power",
    description: "Secondary battery bank at 12% capacity. Maintenance intervention requested.",
    severity: "warning", timestamp: "14m ago", status: "active",
  },
  {
    id: "al3", type: "signal_lost", badge: "SIGNAL LOST", title: "Patrol Unit 07",
    description: "Heartbeat signal missing for over 60 seconds. Last known pos: Level 2 Parking.",
    severity: "warning", timestamp: "1h ago", status: "active",
  },
  {
    id: "al4", type: "mechanical", badge: "RESOLVED", title: "Mechanical Fault: Gate 3",
    description: "Automatic gate obstruction cleared. System reboot successful.",
    severity: "resolved", timestamp: "3h ago", status: "resolved",
  },
];

// ─── Audit Events ─────────────────────────────────────────────────────────────

export const mockAuditEvents: AuditEvent[] = [
  { id: "ae1", timestamp: "14:22:15", userInitials: "JA", userName: "James Aris", action: "Checked-in Visitor", actionType: "check_in", condoUnit: "PH-1202", details: "Courier (FedEx Express) for Resident Marks." },
  { id: "ae2", timestamp: "13:58:42", userInitials: "LM", userName: "Lydia Moon", action: "Approved Visit", actionType: "approved", condoUnit: "402-A", details: "Scheduled guest (Sarah Jenkins) approved via mobile." },
  { id: "ae3", timestamp: "13:45:10", userInitials: "SYS", userName: "System Core", action: "Unrecognized Entry", actionType: "alert", condoUnit: "Service Elev.", details: "Access denied to keycard #8832 at North Freight exit." },
  { id: "ae4", timestamp: "12:10:05", userInitials: "JA", userName: "James Aris", action: "Valet Request", actionType: "valet", condoUnit: "1505", details: "Resident 1505 requested vehicle pickup for 12:30 PM." },
  { id: "ae5", timestamp: "11:55:22", userInitials: "LM", userName: "Lydia Moon", action: "Package Logged", actionType: "package", condoUnit: "2201-B", details: "Signature received for luxury apparel delivery." },
  { id: "ae6", timestamp: "11:30:00", userInitials: "JA", userName: "James Aris", action: "Check-out Visitor", actionType: "check_out", condoUnit: "Unit 805", details: "Marcus Thompson exited lobby. GPS device returned." },
];

// ─── Condominium (single) ─────────────────────────────────────────────────────

export const mockCondo: Condo = {
  id: "c1",
  name: "The Obsidian Tower",
  type: "Luxury Residential",
  address: "402 Obsidian Ave, Downtown Core",
  neighborhood: "Downtown Core",
  city: "New York, NY",
  unitCapacity: 480,
  totalUnits: 124,
  occupiedUnits: 116,
  blocks: 3,
  residents: 248,
  status: "active",
};

// ─── Blocks & Units ───────────────────────────────────────────────────────────

export const mockBlocks: Block[] = [
  {
    id: "b1", name: "A", fullName: "Block A: Obsidian North", totalUnits: 48, status: "active",
    units: [
      { id: "u101", number: "101", status: "occupied", resident: "Mr. Julian Vane" },
      { id: "u102", number: "102", status: "occupied", resident: "Sarah Jenkins" },
      { id: "u103", number: "103", status: "vacant" },
      { id: "u104", number: "104", status: "occupied", resident: "The Marcus Family" },
      { id: "u105", number: "105", status: "maintenance", note: "Leak Repair" },
      { id: "u106", number: "106", status: "occupied", resident: "Elena Rodriguez" },
    ],
  },
  {
    id: "b2", name: "B", fullName: "Block B: Obsidian South", totalUnits: 32, status: "active",
    units: [
      { id: "ub1200", number: "B-1200", status: "occupied", resident: "Lois Miclsen", featured: true, note: "Penthouse Floor" },
      { id: "ub201", number: "B-201", status: "occupied" },
      { id: "ub202", number: "B-202", status: "occupied" },
      { id: "ub203", number: "B-203", status: "vacant" },
      { id: "ub204", number: "B-204", status: "occupied" },
      { id: "ub301", number: "B-301", status: "occupied" },
      { id: "ub302", number: "B-302", status: "vacant" },
      { id: "ub303", number: "B-303", status: "occupied" },
      { id: "ub304", number: "B-304", status: "occupied" },
    ],
  },
  {
    id: "b3", name: "C", fullName: "Block C: Skyline Pavilion", totalUnits: 44, status: "planning",
    units: [],
  },
];
