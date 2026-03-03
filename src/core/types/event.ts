import { z } from 'zod';

export type EventStatus = 'Active' | 'Closed';

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  status: EventStatus;
}

export const EventSchema = z.object({
  name: z.string().min(3, 'O nome deve ter ao menos 3 caracteres'),
  date: z.string().min(1, 'A data é obrigatória'),
  location: z.string().min(2, 'A localização é obrigatória'),
  status: z.enum(['Active', 'Closed']),
});

export type EventFormData = z.infer<typeof EventSchema>;