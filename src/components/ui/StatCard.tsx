import { Card } from './Card';

export const StatCard = ({ label, value, description }: any) => (
  <Card className="bg-apple-card border border-white/5 p-6 hover:bg-apple-secondary transition-colors">
    <p className="text-apple-textSecondary text-[10px] font-bold uppercase tracking-widest mb-1">
      {label}
    </p>
    <p className="text-3xl font-bold text-apple-text tracking-tighter">
      {value}
    </p>
    {description && (
      <p className="text-apple-textSecondary text-xs mt-2 font-medium">
        {description}
      </p>
    )}
  </Card>
);