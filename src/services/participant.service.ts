import { Participant } from '@/core/types/participant';

export const ParticipantService = {
  async getParticipants(): Promise<Participant[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: '1', name: 'Alice Silva', email: 'alice@email.com', eventId: '1', eventName: 'Web Summit Rio', checkInDone: true },
          { id: '2', name: 'Bruno Costa', email: 'bruno@email.com', eventId: '1', eventName: 'Web Summit Rio', checkInDone: false },
          { id: '3', name: 'Carla Dias', email: 'carla@email.com', eventId: '2', eventName: 'React Conf Brazil', checkInDone: false },
        ]);
      }, 600);
    });
  },

  async transferParticipant(id: string, newEventId: string): Promise<void> {
    // Simulação de alteração via API
    console.log(`Transferindo ${id} para evento ${newEventId}`);
    return new Promise(res => setTimeout(res, 500));
  }
};