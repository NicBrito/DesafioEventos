export interface DashboardStats {
  totalEvents: number; [cite: 28]
  totalParticipants: number; [cite: 29]
  upcomingEvents: {
    id: string;
    name: string;
    date: string; [cite: 30]
  }[];
}