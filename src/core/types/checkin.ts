export type RuleType = 'QR Code' | 'Documento' | 'Lista Impressa' | 'Confirmação por E-mail';

export interface CheckInRule {
  id: string;
  name: RuleType;
  windowOpenMinutes: number;
  windowCloseMinutes: number;
  isRequired: boolean;        
  isActive: boolean;
}