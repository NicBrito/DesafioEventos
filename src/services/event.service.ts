import { CheckInRule } from '@/core/types/checkin';
import { Event } from '@/core/types/event';
import { ensureAuthenticatedRequest } from './auth-guard';

let eventsMock: Event[] = [
  { id: '1', name: 'Web Summit Rio', date: '2026-04-15', location: 'Rio de Janeiro', status: 'Active' },
  { id: '2', name: 'React Conf Brazil', date: '2026-05-20', location: 'São Paulo', status: 'Active' },
  { id: '3', name: 'AI Masters 2025', date: '2025-11-10', location: 'Belo Horizonte', status: 'Closed' },
];

const checkInRulesByEventMock: Record<string, CheckInRule[]> = {
  '1': [
    { id: 'rule-1', name: 'QR Code', windowOpenMinutes: 60, windowCloseMinutes: 30, isRequired: true, isActive: true },
    { id: 'rule-2', name: 'Documento', windowOpenMinutes: 45, windowCloseMinutes: 45, isRequired: false, isActive: true },
  ],
  '2': [
    { id: 'rule-3', name: 'Confirmação por E-mail', windowOpenMinutes: 120, windowCloseMinutes: 15, isRequired: true, isActive: true },
  ],
  '3': [
    { id: 'rule-4', name: 'Lista Impressa', windowOpenMinutes: 30, windowCloseMinutes: 10, isRequired: true, isActive: false },
  ],
};

export const EventService = {

  async getEvents(): Promise<Event[]> {
    ensureAuthenticatedRequest();
    return new Promise((resolve) => {

      setTimeout(() => {
        resolve([...eventsMock]);
      }, 1000);
    });
  },

  async createEvent(eventData: Omit<Event, 'id'>): Promise<Event> {
    ensureAuthenticatedRequest();
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
  },

  async updateEvent(id: string, eventData: Omit<Event, 'id'>): Promise<Event> {
    ensureAuthenticatedRequest();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const eventIndex = eventsMock.findIndex((event) => event.id === id);

        if (eventIndex === -1) {
          reject(new Error('Evento não encontrado.'));
          return;
        }

        const updatedEvent: Event = { id, ...eventData };
        eventsMock[eventIndex] = updatedEvent;
        resolve(updatedEvent);
      }, 500);
    });
  },

  async deleteEvent(id: string): Promise<void> {
    ensureAuthenticatedRequest();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const previousLength = eventsMock.length;
        eventsMock = eventsMock.filter((event) => event.id !== id);

        if (eventsMock.length === previousLength) {
          reject(new Error('Evento não encontrado.'));
          return;
        }

        resolve();
      }, 500);
    });
  },

  async getEventById(id: string): Promise<Event | null> {
    ensureAuthenticatedRequest();
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundEvent = eventsMock.find((event) => event.id === id) ?? null;
        resolve(foundEvent);
      }, 400);
    });
  },

  async getCheckInRules(eventId: string): Promise<CheckInRule[]> {
    ensureAuthenticatedRequest();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...(checkInRulesByEventMock[eventId] ?? [])]);
      }, 400);
    });
  },

  async updateCheckInRules(eventId: string, rules: CheckInRule[]): Promise<CheckInRule[]> {
    ensureAuthenticatedRequest();
    return new Promise((resolve) => {
      setTimeout(() => {
        checkInRulesByEventMock[eventId] = [...rules];
        resolve([...(checkInRulesByEventMock[eventId] ?? [])]);
      }, 400);
    });
  }
};