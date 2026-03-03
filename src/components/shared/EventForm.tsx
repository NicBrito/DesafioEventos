'use client';

import { Event, EventFormData, EventSchema } from '@/core/types/event';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface EventFormProps {
  onSubmit: (data: EventFormData) => void | Promise<void>;
  initialData?: Partial<Event>;
  isLoading?: boolean;
  submitLabel?: string;
}

export function EventForm({ onSubmit, initialData, isLoading, submitLabel }: EventFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<EventFormData>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      date: initialData?.date ?? '',
      location: initialData?.location ?? '',
      status: initialData?.status ?? 'Active',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1">
        <label className="text-xs font-bold text-apple-textSecondary uppercase tracking-widest ml-1">Nome do Evento</label>
        <Input {...register('name')} placeholder="Ex: Tech Summit 2026" className={errors.name ? 'border-apple-error' : ''} />
        {errors.name && <p className="text-apple-error text-[10px] font-bold ml-1">{errors.name.message as string}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-apple-textSecondary uppercase tracking-widest ml-1">Data</label>
          <Input type="date" {...register('date')} className={errors.date ? 'border-apple-error' : ''} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-apple-textSecondary uppercase tracking-widest ml-1">Status</label>
          <select
            {...register('status')}
            className="select-dark w-full h-[44px] rounded-apple px-4"
          >
            <option value="Active">Ativo</option>
            <option value="Closed">Encerrado</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-apple-textSecondary uppercase tracking-widest ml-1">Localização</label>
        <Input {...register('location')} placeholder="Cidade, Estado ou Virtual" />
      </div>

      <div className="pt-4 flex gap-3">
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? 'Salvando...' : submitLabel ?? 'Criar Evento'}
        </Button>
      </div>
    </form>
  );
}