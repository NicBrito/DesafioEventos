'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { EventForm } from '@/components/shared/EventForm';
import { useEvents } from '@/hooks/useEvents';
import { EventFormData, EventStatus } from '@/core/types/event';
import { Calendar, MapPin, MoreHorizontal, Plus, Search, Settings2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EventsPage() {
  const { filteredEvents, loading, search, setSearch, statusFilter, setStatusFilter, createEvent } = useEvents();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manipulação de criação de evento (Requisito funcional )
  const handleCreateEvent = async (data: EventFormData) => {
    setIsSubmitting(true);
    try {
      await createEvent(data);
      setIsModalOpen(false);
      router.push('/eventos');
    } catch {
      console.error('Erro ao criar evento');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Header com Ação de Criação  */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-apple-text tracking-tight">Eventos</h1>
          <p className="text-apple-textSecondary text-sm">Gerencie e monitore as regras de acesso e check-in.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 shadow-lg shadow-apple-blue/20">
          <Plus size={18} /> Novo Evento
        </Button>
      </div>

      {/* Filtros de Busca e Status [cite: 35] */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-textSecondary" size={18} />
          <Input
            className="pl-10 bg-apple-card border-white/5 text-apple-text"
            placeholder="Buscar por nome ou local..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-[44px] px-4 rounded-apple border border-white/5 bg-apple-card text-apple-text text-sm focus:ring-2 focus:ring-apple-blue/50 outline-none transition-all cursor-pointer"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as EventStatus | 'All')}
        >
          <option value="All">Todos os Status</option>
          <option value="Active">Ativos</option>
          <option value="Closed">Encerrados</option>
        </select>
      </div>

      {/* Grid de Eventos com Feedbacks  */}
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
                  <button className="text-apple-textSecondary hover:text-white transition-colors">
                    <MoreHorizontal size={20}/>
                  </button>
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
                <Button variant="secondary" className="flex-1 text-xs h-9 font-bold bg-white/5 hover:bg-white/10 border-white/5">
                  Editar
                </Button>
                <Link href={`/eventos/${event.id}/checkin`} className="flex-1">
                  <Button variant="ghost" className="w-full text-xs h-9 font-bold text-apple-blue hover:bg-apple-blue/10">
                    <Settings2 size={14} className="mr-2" /> Regras
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Criação [cite: 36, 62] */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Evento"
      >
        <EventForm
          onSubmit={handleCreateEvent}
          isLoading={isSubmitting}
        />
      </Modal>
    </DashboardLayout>
  );
}