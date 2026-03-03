'use client';

import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Event } from '@/core/types/event';
import { Participant, ParticipantFormData, ParticipantSchema } from '@/core/types/participant';
import { EventService } from '@/services/event.service';
import { ParticipantService } from '@/services/participant.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowRightLeft, Mail, Search, Trash2, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('All');
  const [checkInFilter, setCheckInFilter] = useState<'All' | 'Done' | 'Pending'>('All');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState<Participant | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [transferEventId, setTransferEventId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ParticipantFormData>({
    resolver: zodResolver(ParticipantSchema),
    defaultValues: {
      name: '',
      email: '',
      eventId: '',
      checkInDone: false,
    }
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [participantsData, eventsData] = await Promise.all([
        ParticipantService.getParticipants(),
        EventService.getEvents(),
      ]);
      setParticipants(participantsData);
      setEvents(eventsData);
    } catch {
      setError('Falha ao carregar participantes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setSelectedParticipant(null);
    reset({
      name: '',
      email: '',
      eventId: events[0]?.id ?? '',
      checkInDone: false,
    });
    setIsFormModalOpen(true);
  };

  const openEditModal = (participant: Participant) => {
    setSelectedParticipant(participant);
    reset({
      name: participant.name,
      email: participant.email,
      eventId: participant.eventId,
      checkInDone: participant.checkInDone,
    });
    setIsFormModalOpen(true);
  };

  const handleSaveParticipant = async (data: ParticipantFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (selectedParticipant) {
        const updated = await ParticipantService.updateParticipant(selectedParticipant.id, data);
        setParticipants((current) => current.map((participant) => participant.id === updated.id ? updated : participant));
      } else {
        const created = await ParticipantService.createParticipant(data);
        setParticipants((current) => [created, ...current]);
      }

      setIsFormModalOpen(false);
      setSelectedParticipant(null);
    } catch {
      setError('Não foi possível salvar o participante.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteParticipant = async () => {
    if (!participantToDelete) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await ParticipantService.deleteParticipant(participantToDelete.id);
      setParticipants((current) => current.filter((participant) => participant.id !== participantToDelete.id));
      setParticipantToDelete(null);
    } catch {
      setError('Não foi possível remover o participante.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openTransferModal = (participant: Participant) => {
    setSelectedParticipant(participant);
    const firstAlternativeEvent = events.find((event) => event.id !== participant.eventId);
    setTransferEventId(firstAlternativeEvent?.id ?? participant.eventId);
    setIsTransferModalOpen(true);
  };

  const handleTransferParticipant = async () => {
    if (!selectedParticipant || !transferEventId || selectedParticipant.eventId === transferEventId) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await ParticipantService.transferParticipant(selectedParticipant.id, transferEventId);
      const targetEvent = events.find((event) => event.id === transferEventId);

      setParticipants((current) =>
        current.map((participant) =>
          participant.id === selectedParticipant.id
            ? { ...participant, eventId: transferEventId, eventName: targetEvent?.name ?? participant.eventName }
            : participant
        )
      );

      setIsTransferModalOpen(false);
      setSelectedParticipant(null);
    } catch {
      setError('Não foi possível transferir o participante.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = participants.filter(p =>
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase())) &&
    (eventFilter === 'All' || p.eventId === eventFilter) &&
    (checkInFilter === 'All' || (checkInFilter === 'Done' ? p.checkInDone : !p.checkInDone))
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-apple-text tracking-tight">Participantes</h1>
          <p className="text-apple-gray text-sm">Gerencie inscrições e status de acesso.</p>
        </div>
        <Button className="flex items-center gap-2" onClick={openCreateModal}>
          <UserPlus size={18} /> Novo Participante
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-apple-error/20 bg-apple-error/10">
          <p className="text-apple-error text-sm font-medium flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray" size={18} />
          <Input
            className="pl-10 bg-apple-card border-white/10 text-apple-text"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          className="select-dark h-[44px] px-4 rounded-apple"
        >
          <option value="All">Todos os Eventos</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>{event.name}</option>
          ))}
        </select>
        <select
          value={checkInFilter}
          onChange={(e) => setCheckInFilter(e.target.value as 'All' | 'Done' | 'Pending')}
          className="select-dark h-[44px] px-4 rounded-apple"
        >
          <option value="All">Todos os Check-ins</option>
          <option value="Done">Check-in Feito</option>
          <option value="Pending">Não Feito</option>
        </select>
      </div>

      {loading ? (
        <Card className="p-10 text-center text-apple-gray">Carregando...</Card>
      ) : filtered.length === 0 ? (
        <Card className="p-10 text-center text-apple-gray">Nenhum participante encontrado.</Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-apple-bg/50 border-b border-black/5">
                <th className="p-4 text-xs font-bold text-apple-gray uppercase tracking-wider">Nome</th>
                <th className="p-4 text-xs font-bold text-apple-gray uppercase tracking-wider">Evento</th>
                <th className="p-4 text-xs font-bold text-apple-gray uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-apple-gray uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-apple-bg/30 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-apple-text">{p.name}</div>
                    <div className="text-xs text-apple-gray flex items-center gap-1"><Mail size={10}/> {p.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-apple-text font-medium">{p.eventName}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      p.checkInDone ? 'bg-apple-success/10 text-apple-success' : 'bg-apple-gray/10 text-apple-gray'
                    }`}>
                      {p.checkInDone ? 'Check-in Feito' : 'Pendente'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Button variant="secondary" className="h-8 px-3 text-xs" onClick={() => openEditModal(p)}>
                      Editar
                    </Button>
                    <Button variant="ghost" className="h-8 px-3 text-xs text-apple-blue" onClick={() => openTransferModal(p)}>
                      <ArrowRightLeft size={14} className="mr-1" /> Transferir
                    </Button>
                    <Button variant="danger" className="h-8 px-3 text-xs" onClick={() => setParticipantToDelete(p)}>
                      <Trash2 size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedParticipant(null);
        }}
        title={selectedParticipant ? 'Editar Participante' : 'Novo Participante'}
      >
        <form onSubmit={handleSubmit(handleSaveParticipant)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-apple-gray uppercase ml-1 mb-1 tracking-wider">Nome</label>
            <Input {...register('name')} className={errors.name ? 'border-apple-error' : ''} />
            {errors.name && <p className="text-apple-error text-[10px] mt-1 ml-1 font-medium">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-apple-gray uppercase ml-1 mb-1 tracking-wider">E-mail</label>
            <Input type="email" {...register('email')} className={errors.email ? 'border-apple-error' : ''} />
            {errors.email && <p className="text-apple-error text-[10px] mt-1 ml-1 font-medium">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-apple-gray uppercase ml-1 mb-1 tracking-wider">Evento</label>
            <select
              {...register('eventId')}
              className="select-dark w-full h-[44px] px-4 rounded-apple"
            >
              <option value="">Selecione um evento</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>{event.name}</option>
              ))}
            </select>
            {errors.eventId && <p className="text-apple-error text-[10px] mt-1 ml-1 font-medium">{errors.eventId.message}</p>}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="checkInDone"
              className="h-4 w-4 rounded border-black/20"
              {...register('checkInDone')}
            />
            <label htmlFor="checkInDone" className="text-sm text-apple-text">Check-in já realizado</label>
          </div>
          <div className="pt-2 flex gap-3">
            <Button variant="secondary" type="button" className="flex-1" onClick={() => setIsFormModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : selectedParticipant ? 'Salvar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isTransferModalOpen}
        onClose={() => {
          setIsTransferModalOpen(false);
          setSelectedParticipant(null);
        }}
        title="Transferir Participante"
      >
        <div className="space-y-4">
          <p className="text-sm text-apple-textSecondary">
            Escolha o novo evento para <span className="font-semibold text-apple-text">{selectedParticipant?.name}</span>.
          </p>
          <select
            value={transferEventId}
            onChange={(e) => setTransferEventId(e.target.value)}
            className="select-dark w-full h-[44px] px-4 rounded-apple"
          >
            {events
              .filter((event) => event.id !== selectedParticipant?.eventId)
              .map((event) => (
                <option key={event.id} value={event.id}>{event.name}</option>
              ))}
          </select>
          <div className="pt-2 flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setIsTransferModalOpen(false)}>
              Cancelar
            </Button>
            <Button className="flex-1" onClick={handleTransferParticipant} disabled={isSubmitting || !transferEventId}>
              {isSubmitting ? 'Transferindo...' : 'Transferir'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(participantToDelete)}
        onClose={() => setParticipantToDelete(null)}
        title="Remover Participante"
      >
        <div className="space-y-6">
          <p className="text-sm text-apple-textSecondary">
            Confirma a remoção de <span className="font-semibold text-apple-text">{participantToDelete?.name}</span>?
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setParticipantToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="danger" className="flex-1" onClick={handleDeleteParticipant} disabled={isSubmitting}>
              {isSubmitting ? 'Removendo...' : 'Remover'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}