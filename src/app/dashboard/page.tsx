import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { StatCard } from '@/components/ui/StatCard';

export default function DashboardPage() {
  
  const stats = {
    totalEvents: 12, [cite: 28]
    totalParticipants: 450, [cite: 29]
    activeRules: 5
  };

  return (
    <DashboardLayout>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-apple-text tracking-tight">Visão Geral</h1> [cite: 27]
        <p className="text-apple-gray mt-2">Bem-vindo ao painel de controle do organizador.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard label="Total de Eventos" value={stats.totalEvents} description="Eventos cadastrados" /> [cite: 28]
        <StatCard label="Participantes" value={stats.totalParticipants} description="Inscrições confirmadas" /> [cite: 29]
        <StatCard label="Check-ins Recentes" value="89%" description="Taxa de comparecimento" /> [cite: 30]
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">Atividades Recentes</h2> [cite: 30]
        <div className="bg-white rounded-apple border border-black/5 divide-y divide-black/5">
          {/* Mock de lista de atividades */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 text-sm flex justify-between items-center">
              <div>
                <p className="font-medium">Novo check-in realizado</p>
                <p className="text-apple-gray text-xs">Participante #2934 no evento Tech Conf</p>
              </div>
              <span className="text-apple-gray text-xs">há 5 min</span>
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}