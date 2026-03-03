'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckInRule, RuleType } from '@/core/types/checkin';
import { useCheckInLogic } from '@/hooks/useCheckInLogic';
import { AlertTriangle, Plus, Trash2, CheckCircle, Clock } from 'lucide-react';

export default function CheckInConfigPage() {
  const [rules, setRules] = useState<CheckInRule[]>([]);
  const { validateConflicts } = useCheckInLogic();
  const conflictError = validateConflicts(rules);

  const addRule = (type: RuleType) => {
    const newRule: CheckInRule = {
      id: crypto.randomUUID(),
      name: type,
      windowOpenMinutes: 60,
      windowCloseMinutes: 30,
      isRequired: true,
      isActive: true
    };
    setRules([...rules, newRule]); // Adicionar nova regra
  };

  const toggleStatus = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r)); // Ativar/desativar 
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id)); // Remover regra
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-apple-text tracking-tight">Regras de Check-in</h1>
          <p className="text-apple-gray text-sm mt-1">Defina as obrigatoriedades e janelas de acesso.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => addRule('QR Code')} className="text-xs h-9">
            <Plus size={14} className="mr-1"/> QR Code
          </Button>
          <Button variant="secondary" onClick={() => addRule('Documento')} className="text-xs h-9">
            <Plus size={14} className="mr-1"/> Documento
          </Button>
        </div>
      </div>

      {/* Alerta de violação de regra  */}
      {conflictError && (
        <div className="mb-6 p-4 rounded-apple bg-apple-error/10 border border-apple-error/20 flex gap-3 text-apple-error text-sm animate-pulse">
          <AlertTriangle size={20} className="shrink-0" />
          <p className="font-medium">{conflictError}</p>
        </div>
      )}

      <div className="grid gap-4">
        {rules.map((rule) => (
          <Card key={rule.id} className={`transition-all border-l-4 ${rule.isActive ? 'border-l-apple-blue' : 'border-l-apple-gray/30'}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-apple-text">{rule.name}</h3>
                  {rule.isRequired && (
                    <span className="text-[10px] bg-apple-blue/10 text-apple-blue px-2 py-0.5 rounded-full font-bold uppercase">Obrigatório</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-xs text-apple-gray">
                    <Clock size={14} />
                    Abre: <span className="font-mono bg-apple-bg px-1 rounded">{rule.windowOpenMinutes}m antes</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-apple-gray">
                    <Clock size={14} />
                    Fecha: <span className="font-mono bg-apple-bg px-1 rounded">{rule.windowCloseMinutes}m depois</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant={rule.isActive ? 'primary' : 'secondary'}
                  className="h-9 px-4 text-xs"
                  onClick={() => toggleStatus(rule.id)}
                >
                  {rule.isActive ? 'Ativa' : 'Inativa'}
                </Button>
                <Button
                  variant="ghost"
                  className="h-9 w-9 p-0 text-apple-error hover:bg-apple-error/5"
                  onClick={() => removeRule(rule.id)}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {rules.length === 0 && (
          <Card className="py-16 border-dashed flex flex-col items-center justify-center text-apple-gray bg-transparent">
            <CheckCircle size={40} className="mb-4 opacity-10" />
            <p className="text-sm font-medium">Nenhuma regra definida para este evento.</p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}