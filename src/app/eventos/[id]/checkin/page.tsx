'use client';

import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { CheckInRule, RuleType } from '@/core/types/checkin';
import { useCheckInLogic } from '@/hooks/useCheckInLogic';
import { EventService } from '@/services/event.service';
import { AlertCircle, AlertTriangle, CheckCircle, Clock, Plus, Save, Trash2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const ruleTypeOptions: RuleType[] = ['QR Code', 'Documento', 'Lista Impressa', 'Confirmação por E-mail'];

function normalizeMinutes(value: string) {
  const parsedValue = Number(value);
  if (Number.isNaN(parsedValue) || parsedValue < 0) return 0;
  return Math.floor(parsedValue);
}

export default function CheckInConfigPage() {
  const params = useParams<{ id: string }>();
  const eventId = params.id;
  const [rules, setRules] = useState<CheckInRule[]>([]);
  const [newRuleType, setNewRuleType] = useState<RuleType>('QR Code');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { validateConflicts } = useCheckInLogic();
  const conflictError = validateConflicts(rules);

  const loadRules = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const fetchedRules = await EventService.getCheckInRules(eventId);
      setRules(fetchedRules);
    } catch {
      setError('Não foi possível carregar as regras de check-in.');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadRules();
  }, [loadRules]);

  const addRule = (type: RuleType) => {
    setSuccess(null);
    const newRule: CheckInRule = {
      id: crypto.randomUUID(),
      name: type,
      windowOpenMinutes: 60,
      windowCloseMinutes: 30,
      isRequired: true,
      isActive: true
    };
    setRules([...rules, newRule]);
  };

  const toggleStatus = (id: string) => {
    setSuccess(null);
    setRules(rules.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
  };

  const removeRule = (id: string) => {
    setSuccess(null);
    setRules(rules.filter(r => r.id !== id));
  };

  const updateRule = (id: string, payload: Partial<CheckInRule>) => {
    setSuccess(null);
    setRules((currentRules) =>
      currentRules.map((rule) => rule.id === id ? { ...rule, ...payload } : rule)
    );
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    if (conflictError) {
      setError('Resolva os conflitos de validação antes de salvar as regras.');
      return;
    }

    setSaving(true);
    try {
      const updatedRules = await EventService.updateCheckInRules(eventId, rules);
      setRules(updatedRules);
      setSuccess('Regras salvas com sucesso.');
    } catch {
      setError('Não foi possível salvar as regras de check-in.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-apple-text tracking-tight">Regras de Check-in</h1>
          <p className="text-apple-gray text-sm mt-1">Defina as obrigatoriedades e janelas de acesso.</p>
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={newRuleType}
            onChange={(event) => setNewRuleType(event.target.value as RuleType)}
            className="select-dark h-[36px] px-3 rounded-apple"
          >
            {ruleTypeOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <Button variant="secondary" onClick={() => addRule(newRuleType)} className="text-xs h-9">
            <Plus size={14} className="mr-1"/> Adicionar
          </Button>
          <Button onClick={handleSave} className="text-xs h-9" disabled={saving || loading}>
            <Save size={14} className="mr-1"/> {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-apple bg-apple-error/10 border border-apple-error/20 flex gap-3 text-apple-error text-sm">
          <AlertCircle size={20} className="shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-apple bg-apple-success/10 border border-apple-success/20 flex gap-3 text-apple-success text-sm">
          <CheckCircle size={20} className="shrink-0" />
          <p className="font-medium">{success}</p>
        </div>
      )}

      {conflictError && (
        <div className="mb-6 p-4 rounded-apple bg-apple-error/10 border border-apple-error/20 flex gap-3 text-apple-error text-sm animate-pulse">
          <AlertTriangle size={20} className="shrink-0" />
          <p className="font-medium">{conflictError}</p>
        </div>
      )}

      {loading ? (
        <Card className="py-16 border-dashed flex flex-col items-center justify-center text-apple-gray bg-transparent">
          <p className="text-sm font-medium">Carregando regras...</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {rules.map((rule) => (
            <Card key={rule.id} className={`transition-all border-l-4 ${rule.isActive ? 'border-l-apple-blue' : 'border-l-apple-gray/30'}`}>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-apple-gray uppercase tracking-wider block mb-1">Tipo</label>
                      <select
                        value={rule.name}
                        onChange={(event) => updateRule(rule.id, { name: event.target.value as RuleType })}
                        className="select-dark w-full h-[38px] px-3 rounded-apple"
                      >
                        {ruleTypeOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-apple-gray uppercase tracking-wider block mb-1">Abre (min antes)</label>
                      <Input
                        type="number"
                        min={0}
                        value={rule.windowOpenMinutes}
                        className="bg-apple-card border-white/10 text-apple-text"
                        onChange={(event) => updateRule(rule.id, { windowOpenMinutes: normalizeMinutes(event.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-apple-gray uppercase tracking-wider block mb-1">Fecha (min depois)</label>
                      <Input
                        type="number"
                        min={0}
                        value={rule.windowCloseMinutes}
                        className="bg-apple-card border-white/10 text-apple-text"
                        onChange={(event) => updateRule(rule.id, { windowCloseMinutes: normalizeMinutes(event.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-apple-gray">
                    <Clock size={14} />
                    Janela ativa entre
                    <span className="font-mono bg-apple-bg px-1 rounded">-{rule.windowOpenMinutes}m</span>
                    e
                    <span className="font-mono bg-apple-bg px-1 rounded">+{rule.windowCloseMinutes}m</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={rule.isRequired ? 'primary' : 'secondary'}
                      className="h-9 px-4 text-xs"
                      onClick={() => updateRule(rule.id, { isRequired: !rule.isRequired })}
                    >
                      {rule.isRequired ? 'Obrigatória' : 'Optional'}
                    </Button>
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
      )}
    </DashboardLayout>
  );
}