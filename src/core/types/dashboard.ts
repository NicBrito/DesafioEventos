export interface DashboardStats {
  totalEvents: number;
  totalParticipants: number;
  upcomingEvents: {
    id: string;
    name: string;
    date: string; 
  }[];
}