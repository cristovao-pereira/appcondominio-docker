import { mockDashboardStats, mockRecentMovements, mockAlerts } from '@/data/mockData';

export function useDashboard() {
  return {
    stats: mockDashboardStats,
    movements: mockRecentMovements,
    alerts: mockAlerts,
    loading: false,
  };
}

