'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Participant } from '@/core/types/participant';
import { ParticipantService } from '@/services/participant.service';
import { Search, UserPlus, ArrowRightLeft, Mail } from 'lucide-react';

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    ParticipantService.getParticipants().then(data => {
      setParticipants(data);
      setLoading(false);
    });
  }, []);

  const filtered = participants.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-apple-text tracking-tight">Participantes</h1>
          <p className="text-apple-gray text-sm">Gerencie inscrições e status de acesso[cite: 39].</p>
        </div>
        <Button className="flex items-center gap-2">
          <UserPlus size={18} /> Novo Participante
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray" size={18} />
        <Input
          className="pl-10"
          placeholder="Buscar por nome ou e-mail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

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
            {loading ? (
              <tr><td colSpan={4} className="p-10 text-center text-apple-gray">Carregando...</td></tr>
            ) : filtered.map(p => (
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
                  <Button variant="secondary" className="h-8 px-3 text-xs">Editar</Button>
                  <Button variant="ghost" className="h-8 px-3 text-xs text-apple-blue">
                    <ArrowRightLeft size={14} className="mr-1" /> Transferir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </DashboardLayout>
  );
}