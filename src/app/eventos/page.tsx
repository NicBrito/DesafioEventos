'use client';

import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useEvents } from '@/hooks/useEvents';
import { Search, Plus, Calendar, MapPin, MoreHorizontal } from 'lucide-react';

export default function EventsPage() {
  const { filteredEvents, loading, search, setSearch, statusFilter, setStatusFilter } = useEvents();

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-apple-text tracking-tight">Eventos</h1>
          <p className="text-apple-gray text-sm">Gerencie e monitore as regras de acesso[cite: 5].</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={18} /> Novo Evento [cite: 36]
        </Button>
      </div>

      {/* Filtros [cite: 35] */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray" size={18} />
          <Input
            className="pl-10"
            placeholder="Buscar por nome ou local..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-[44px] px-4 rounded-apple border border-black/10 bg-white text-sm focus:ring-2 focus:ring-apple-blue/50 outline-none transition-all"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="All">Todos os Status</option>
          <option value="Active">Ativos</option>
          <option value="Closed">Encerrados</option>
        </select>
      </div>

      {/* Grid de Eventos [cite: 32] */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Card key={i} className="h-48 animate-pulse bg-gray-100" />)}
        </div>
      ) : filteredEvents.length === 0 ? (
        <Card className="py-20 text-center flex flex-col items-center gap-2">
          <Calendar className="text-apple-gray/20" size={48} />
          <p className="text-apple-gray font-medium">Nenhum evento encontrado[cite: 38].</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <Card key={event.id} className="flex flex-col justify-between hover:border-apple-blue/30 transition-all group">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    event.status === 'Active' ? 'bg-apple-success/10 text-apple-success' : 'bg-apple-gray/10 text-apple-gray'
                  }`}>
                    {event.status === 'Active' ? 'Ativo' : 'Encerrado'} [cite: 33]
                  </span>
                  <button className="text-apple-gray hover:text-apple-text"><MoreHorizontal size={20}/></button>
                </div>
                <h3 className="text-lg font-bold text-apple-text leading-tight mb-2">{event.name}</h3>
                <div className="space-y-1">
                  <p className="text-xs text-apple-gray flex items-center gap-1"><Calendar size={12}/> {event.date}</p>
                  <p className="text-xs text-apple-gray flex items-center gap-1"><MapPin size={12}/> {event.location}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <Button variant="secondary" className="flex-1 text-xs h-9">Editar</Button>
                <Button variant="ghost" className="flex-1 text-xs h-9">Regras [cite: 48]</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}