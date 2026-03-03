import { Participant } from '@/core/types/participant';
import { ensureAuthenticatedRequest } from './auth-guard';
import { EventService } from './event.service';

let participantsMock: Participant[] = [
  { id: '1', name: 'Alice Silva', email: 'alice@email.com', eventId: '1', eventName: 'Web Summit Rio', checkInDone: true },
  { id: '2', name: 'Bruno Costa', email: 'bruno@email.com', eventId: '1', eventName: 'Web Summit Rio', checkInDone: false },
  { id: '3', name: 'Carla Dias', email: 'carla@email.com', eventId: '2', eventName: 'React Conf Brazil', checkInDone: false },
];

export const ParticipantService = {
  async getParticipants(): Promise<Participant[]> {
    ensureAuthenticatedRequest();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...participantsMock]);
      }, 600);
    });
  },

  async createParticipant(participantData: Omit<Participant, 'id' | 'eventName'>): Promise<Participant> {
    ensureAuthenticatedRequest();
    const event = await EventService.getEventById(participantData.eventId);

    return new Promise((resolve) => {
      setTimeout(() => {
        const createdParticipant: Participant = {
          ...participantData,
          id: Date.now().toString(),
          eventName: event?.name ?? 'Evento não encontrado',
        };

        participantsMock = [createdParticipant, ...participantsMock];
        resolve(createdParticipant);
      }, 500);
    });
  },

  async updateParticipant(id: string, participantData: Omit<Participant, 'id' | 'eventName'>): Promise<Participant> {
    ensureAuthenticatedRequest();
    const event = await EventService.getEventById(participantData.eventId);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const participantIndex = participantsMock.findIndex((participant) => participant.id === id);

        if (participantIndex === -1) {
          reject(new Error('Participante não encontrado.'));
          return;
        }

        const updatedParticipant: Participant = {
          ...participantData,
          id,
          eventName: event?.name ?? 'Evento não encontrado',
        };

        participantsMock[participantIndex] = updatedParticipant;
        resolve(updatedParticipant);
      }, 500);
    });
  },

  async deleteParticipant(id: string): Promise<void> {
    ensureAuthenticatedRequest();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const previousLength = participantsMock.length;
        participantsMock = participantsMock.filter((participant) => participant.id !== id);

        if (participantsMock.length === previousLength) {
          reject(new Error('Participante não encontrado.'));
          return;
        }

        resolve();
      }, 500);
    });
  },

  async transferParticipant(id: string, newEventId: string): Promise<void> {
    ensureAuthenticatedRequest();
    const event = await EventService.getEventById(newEventId);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const participantIndex = participantsMock.findIndex((participant) => participant.id === id);

        if (participantIndex === -1) {
          reject(new Error('Participante não encontrado.'));
          return;
        }

        participantsMock[participantIndex] = {
          ...participantsMock[participantIndex],
          eventId: newEventId,
          eventName: event?.name ?? 'Evento não encontrado',
        };

        resolve();
      }, 500);
    });
  }
};