'use client';

import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { EventForm } from '@/components/shared/EventForm';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Event, EventFormData, EventStatus } from '@/core/types/event';
import { useEvents } from '@/hooks/useEvents';
import { AlertCircle, Calendar, Eye, MapPin, Plus, Settings2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function EventsPage() {
  const {
    filteredEvents,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    periodFilter,
    setPeriodFilter,
    createEvent,
    updateEvent,
    deleteEvent,
  } = useEvents();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateEvent = async (data: EventFormData) => {
    setIsSubmitting(true);
    try {
      await createEvent(data);
      setIsCreateModalOpen(false);
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEvent = async (data: EventFormData) => {
    if (!selectedEvent) return;

    setIsSubmitting(true);
    try {
      await updateEvent(selectedEvent.id, data);
      setIsEditModalOpen(false);
      setSelectedEvent(null);
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;

    setIsSubmitting(true);
    try {
      await deleteEvent(eventToDelete.id);
      setEventToDelete(null);
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-apple-text tracking-tight">Eventos</h1>
          <p className="text-apple-textSecondary text-sm">Gerencie e monitore as regras de acesso e check-in.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 shadow-lg shadow-apple-blue/20">
          <Plus size={18} /> Novo Evento
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-apple-error/20 bg-apple-error/10">
          <p className="text-apple-error text-sm font-medium flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </p>
        </Card>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Input
            className="bg-apple-card border-white/5 text-apple-text"
            placeholder="Buscar por nome ou local..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="select-dark h-[44px] px-4 rounded-apple transition-all cursor-pointer"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as EventStatus | 'All')}
        >
          <option value="All">Todos os Status</option>
          <option value="Active">Ativos</option>
          <option value="Closed">Encerrados</option>
        </select>
        <select
          className="select-dark h-[44px] px-4 rounded-apple transition-all cursor-pointer"
          value={periodFilter}
          onChange={(e) => setPeriodFilter(e.target.value as 'All' | '7d' | '30d' | '90d' | 'thisMonth')}
        >
          <option value="All">Todo período</option>
          <option value="7d">Próximos 7 dias</option>
          <option value="30d">Próximos 30 dias</option>
          <option value="90d">Próximos 90 dias</option>
          <option value="thisMonth">Este mês</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="h-52 animate-pulse bg-apple-card/50 border-white/5" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <Card className="py-24 text-center flex flex-col items-center gap-3 border-dashed border-white/10 bg-transparent">
          <Calendar className="text-apple-textSecondary/20" size={64} />
          <div className="space-y-1">
            <p className="text-apple-text font-semibold text-lg">Nenhum evento encontrado</p>
            <p className="text-apple-textSecondary text-sm">Tente ajustar seus filtros ou criar um novo evento.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <Card key={event.id} className="flex flex-col justify-between border-white/5 hover:border-apple-blue/50 transition-all duration-300 group bg-apple-card">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    event.status === 'Active'
                      ? 'bg-apple-success/10 text-apple-success border border-apple-success/20'
                      : 'bg-apple-textSecondary/10 text-apple-textSecondary border border-white/5'
                  }`}>
                    {event.status === 'Active' ? 'Ativo' : 'Encerrado'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-apple-text leading-tight mb-3 group-hover:text-apple-blue transition-colors">
                  {event.name}
                </h3>

                <div className="space-y-2">
                  <p className="text-xs text-apple-textSecondary flex items-center gap-2">
                    <Calendar size={14} className="text-apple-blue" /> {event.date}
                  </p>
                  <p className="text-xs text-apple-textSecondary flex items-center gap-2">
                    <MapPin size={14} className="text-apple-blue" /> {event.location}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1 text-xs h-9 font-bold bg-white/5 hover:bg-white/10 border-white/5"
                  onClick={() => {
                    setSelectedEvent(event);
                    setIsEditModalOpen(true);
                  }}
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 text-xs h-9 font-bold text-apple-blue hover:bg-apple-blue/10"
                  onClick={() => {
                    setSelectedEvent(event);
                    setIsDetailsModalOpen(true);
                  }}
                >
                  <Eye size={14} className="mr-2" /> Detalhes
                </Button>
                <Button
                  variant="danger"
                  className="h-9 px-3"
                  onClick={() => setEventToDelete(event)}
                  aria-label={`Remover ${event.name}`}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Novo Evento"
      >
        <EventForm
          onSubmit={handleCreateEvent}
          isLoading={isSubmitting}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEvent(null);
        }}
        title="Editar Evento"
      >
        {selectedEvent && (
          <EventForm
            onSubmit={handleEditEvent}
            initialData={selectedEvent}
            isLoading={isSubmitting}
            submitLabel="Salvar Alterações"
          />
        )}
      </Modal>

      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedEvent(null);
        }}
        title="Detalhes do Evento"
      >
        {selectedEvent && (
          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-wider text-apple-textSecondary font-bold">Nome</p>
              <p className="text-lg font-bold text-apple-text mt-1">{selectedEvent.name}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-apple-textSecondary font-bold">Data</p>
                <p className="text-sm text-apple-text mt-1">{selectedEvent.date}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-apple-textSecondary font-bold">Status</p>
                <p className="text-sm text-apple-text mt-1">{selectedEvent.status === 'Active' ? 'Ativo' : 'Encerrado'}</p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-apple-textSecondary font-bold">Local</p>
              <p className="text-sm text-apple-text mt-1">{selectedEvent.location}</p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setIsEditModalOpen(true);
                }}
              >
                Editar Evento
              </Button>
              <Link href={`/eventos/${selectedEvent.id}/checkin`} className="flex-1">
                <Button className="w-full" variant="primary">
                  <Settings2 size={14} className="mr-2" /> Regras de Check-in
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={Boolean(eventToDelete)}
        onClose={() => setEventToDelete(null)}
        title="Remover Evento"
      >
        <div className="space-y-6">
          <p className="text-sm text-apple-textSecondary">
            Confirma a remoção do evento <span className="font-semibold text-apple-text">{eventToDelete?.name}</span>?
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setEventToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="danger" className="flex-1" onClick={handleDeleteEvent} disabled={isSubmitting}>
              {isSubmitting ? 'Removendo...' : 'Remover'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}