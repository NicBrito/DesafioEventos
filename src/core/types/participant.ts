import { z } from 'zod';

export interface Participant {
  id: string;
  name: string;
  email: string;
  eventId: string;
  eventName?: string;
  checkInDone: boolean;
}

export interface TransferParticipantData {
  participantId: string;
  newEventId: string;
}

export const ParticipantSchema = z.object({
  name: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  eventId: z.string().min(1, 'Selecione um evento'),
  checkInDone: z.boolean(),
});

export type ParticipantFormData = z.infer<typeof ParticipantSchema>;