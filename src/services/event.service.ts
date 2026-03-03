import { Event } from '@/core/types/event';

let eventsMock: Event[] = [
  { id: '1', name: 'Web Summit Rio', date: '2026-04-15', location: 'Rio de Janeiro', status: 'Active' },
  { id: '2', name: 'React Conf Brazil', date: '2026-05-20', location: 'São Paulo', status: 'Active' },
  { id: '3', name: 'AI Masters 2025', date: '2025-11-10', location: 'Belo Horizonte', status: 'Closed' },
];

export const EventService = {

  async getEvents(): Promise<Event[]> {
    return new Promise((resolve) => {

      setTimeout(() => {
        resolve([...eventsMock]);
      }, 1000);
    });
  },

  async createEvent(eventData: Omit<Event, 'id'>): Promise<Event> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const createdEvent: Event = {
          ...eventData,
          id: Date.now().toString(),
        };

        eventsMock = [createdEvent, ...eventsMock];
        resolve(createdEvent);
      }, 500);
    });
  }
};