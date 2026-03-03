import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: number | string;
  description?: string;
}

export const StatCard = ({ label, value, description }: StatCardProps) => (
  <Card className="flex flex-col gap-1">
    <span className="text-apple-gray text-xs font-semibold uppercase tracking-wider">{label}</span>
    <span className="text-3xl font-bold text-apple-text tracking-tight">{value}</span>
    {description && <span className="text-apple-gray text-xs mt-1">{description}</span>}
  </Card>
);