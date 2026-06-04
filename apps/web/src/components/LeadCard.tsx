import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Building2, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Lead } from '@/types/lead';
import { useLeadStore } from '@/stores/leadStore';

interface LeadCardProps {
  lead: Lead;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent, leadId: string) => void;
}

const LABEL_CLASS =
  'uppercase tracking-[0.08em] text-[0.65rem] font-semibold text-muted-foreground';

function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value.toLocaleString()}`;
}

export function LeadCard({ lead, isDragging = false, onDragStart }: LeadCardProps) {
  const agents = useLeadStore((s) => s.agents);
  const agent = useMemo(
    () => agents.find((a) => a.id === lead.assignedAgentId),
    [agents, lead.assignedAgentId],
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      draggable
      onDragStart={onDragStart ? (e) => onDragStart(e, lead.id) : undefined}
      className={cn(
        'group bg-card border border-border rounded-lg px-4 py-4 cursor-grab active:cursor-grabbing select-none',
        'shadow-sm',
        'hover:shadow-md transition-shadow duration-[160ms]',
        isDragging && 'opacity-50 rotate-1',
      )}
    >
      {/* Contact & company */}
      <div className="mb-3">
        <h3
          className="text-base font-semibold leading-snug text-foreground"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {lead.contactName}
        </h3>
        {lead.company && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <Building2 size={11} className="text-muted-foreground flex-shrink-0" />
            <span className="text-[0.72rem] text-muted-foreground truncate">{lead.company}</span>
          </div>
        )}
      </div>

      {/* Hairline */}
      <div className="border-t border-border mb-3" />

      {/* Value + agent */}
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className={LABEL_CLASS}>Deal Value</p>
          <p
            className="text-[1.1rem] leading-tight font-medium italic text-primary"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {formatCurrency(lead.dealValue)}
          </p>
        </div>

        {agent && (
          <div className="text-right">
            <p className={LABEL_CLASS}>Agent</p>
            <div className="flex items-center gap-1.5 justify-end mt-0.5">
              <User size={11} className="text-muted-foreground flex-shrink-0" />
              <span className="text-[0.72rem] text-muted-foreground truncate max-w-[90px]">
                {agent.name}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
