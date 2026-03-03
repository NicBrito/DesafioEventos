import { CheckInRule } from '@/core/types/checkin';

export function useCheckInLogic() {
  const validateConflicts = (rules: CheckInRule[]) => {
    const activeRequired = rules.filter(r => r.isActive && r.isRequired);

    // Requisito: Deve existir ao menos 1 regra ativa
    if (rules.filter(r => r.isActive).length === 0) {
      return "Deve existir ao menos 1 regra ativa para o evento.";
    }

    // Lógica de conflito de janela:
    // Se duas regras são obrigatórias, suas janelas de tempo devem ter interseção.
    // Caso contrário, o participante nunca conseguiria cumprir ambas.
    for (let i = 0; i < activeRequired.length; i++) {
      for (let j = i + 1; j < activeRequired.length; j++) {
        const r1 = activeRequired[i];
        const r2 = activeRequired[j];

        const r1Start = -r1.windowOpenMinutes;
        const r1End = r1.windowCloseMinutes;
        const r2Start = -r2.windowOpenMinutes;
        const r2End = r2.windowCloseMinutes;

        const hasOverlap = Math.max(r1Start, r2Start) <= Math.min(r1End, r2End);

        if (!hasOverlap) {
          return `Incompatibilidade: As regras obrigatórias "${r1.name}" e "${r2.name}" possuem janelas de tempo que não se cruzam.`;
        }
      }
    }
    return null;
  };

  return { validateConflicts };
}