export type EventStatus = 'Active' | 'Closed';

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  status: EventStatus;
}