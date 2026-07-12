import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface QuickAdjustmentCardProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  loading?: boolean;
}

export default function QuickAdjustmentCard({
  label,
  icon: Icon,
  onClick,
  loading,
}: QuickAdjustmentCardProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={loading}
      className={cn(
        'flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3.5 text-left transition-colors',
        'hover:border-primary/30 hover:bg-primary/5 disabled:opacity-60',
      )}
    >
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span className="text-sm font-medium text-text">{loading ? 'Applying…' : label}</span>
    </motion.button>
  );
}