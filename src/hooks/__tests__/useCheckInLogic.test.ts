import { describe, it, expect } from 'vitest';
import { useCheckInLogic } from '../useCheckInLogic';
import { CheckInRule } from '@/core/types/checkin';

describe('useCheckInLogic - Validação de Conflitos', () => {
  const { validateConflicts } = useCheckInLogic();

  it('deve retornar erro se não houver nenhuma regra ativa', () => {
    // GIVEN: Uma lista de regras inativas
    const rules: CheckInRule[] = [
      { id: '1', name: 'QR Code', windowOpenMinutes: 60, windowCloseMinutes: 30, isRequired: true, isActive: false }
    ];

    // WHEN: valida conflitos
    const error = validateConflicts(rules);

    // THEN: O sistema deve exigir ao menos uma regra ativa [cite: 54]
    expect(error).toBe('Deve existir ao menos 1 regra ativa para o evento.');
  });

  it('deve detectar conflito entre duas regras obrigatórias com janelas disjuntas', () => {
    // GIVEN: Duas regras obrigatórias que não se sobrepõem no tempo
    const rules: CheckInRule[] = [
      { id: '1', name: 'Regra A', windowOpenMinutes: 60, windowCloseMinutes: -10, isRequired: true, isActive: true },
      { id: '2', name: 'Regra B', windowOpenMinutes: -20, windowCloseMinutes: 60, isRequired: true, isActive: true }
    ];

    // WHEN: Valida a incompatibilidade
    const error = validateConflicts(rules);

    // THEN: Deve retornar uma mensagem de conflito clara
    expect(error).toContain('Incompatibilidade');
  });

  it('deve permitir múltiplas regras obrigatórias se houver interseção de tempo', () => {
    // GIVEN: Duas regras cujas janelas se cruzam
    const rules: CheckInRule[] = [
      { id: '1', name: 'Regra A', windowOpenMinutes: 60, windowCloseMinutes: 30, isRequired: true, isActive: true },
      { id: '2', name: 'Regra B', windowOpenMinutes: 45, windowCloseMinutes: 45, isRequired: true, isActive: true }
    ];

    // WHEN: Valida a lógica
    const error = validateConflicts(rules);

    // THEN: Não deve haver erro
    expect(error).toBeNull();
  });
});