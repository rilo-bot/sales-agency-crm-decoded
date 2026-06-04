import { useState, useMemo, useCallback } from 'react';
import { Plus, Search, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LeadCard } from '@/components/LeadCard';
import { useLeadStore } from '@/stores/leadStore';
import { useAuthStore } from '@/stores/authStore';
import type { PipelineStage, Lead } from '@/types/lead';
import { cn } from '@/lib/utils';

const STAGES: PipelineStage[] = ['New', 'Contacted', 'Proposal', 'Closed'];
const LABEL_CLASS = 'uppercase tracking-[0.08em] text-[0.65rem] font-semibold text-muted-foreground mb-1.5 block';

const STAGE_EMPTY: Record<PipelineStage, { heading: string; body: string }> = {
  New: {
    heading: 'No new leads yet.',
    body: 'Add your first deal when the moment is right.',
  },
  Contacted: {
    heading: 'Nothing here yet.',
    body: 'Move a lead forward when you have made first contact.',
  },
  Proposal: {
    heading: 'No proposals open.',
    body: 'When a deal reaches this stage, it will appear here.',
  },
  Closed: {
    heading: 'No closed deals yet.',
    body: 'Your wins will appear here as deals reach the finish line.',
  },
};

interface NewLeadForm {
  contactName: string;
  company: string;
  email: string;
  phone: string;
  dealValue: string;
  stage: PipelineStage;
  notes: string;
}

const EMPTY_FORM: NewLeadForm = {
  contactName: '',
  company: '',
  email: '',
  phone: '',
  dealValue: '',
  stage: 'New',
  notes: '',
};

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

export default function Pipeline() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState<NewLeadForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<NewLeadForm>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [dragLeadId, setDragLeadId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<PipelineStage | null>(null);

  const leads = useLeadStore((s) => s.leads);
  const agents = useLeadStore((s) => s.agents);
  const addLead = useLeadStore((s) => s.addLead);
  const moveLeadToStage = useLeadStore((s) => s.moveLeadToStage);
  const addAgent = useLeadStore((s) => s.addAgent);
  const currentUser = useAuthStore((s) => s.currentUser);

  const filteredLeads = useMemo(() => {
    if (!searchQuery.trim()) return leads;
    const q = searchQuery.toLowerCase();
    return leads.filter(
      (l) =>
        l.contactName?.toLowerCase().includes(q) ||
        l.company?.toLowerCase().includes(q),
    );
  }, [leads, searchQuery]);

  const stageLeads = useMemo(() => {
    const map: Record<PipelineStage, Lead[]> = {
      New: [],
      Contacted: [],
      Proposal: [],
      Closed: [],
    };
    filteredLeads.forEach((l) => {
      if (map[l.stage]) map[l.stage].push(l);
    });
    return map;
  }, [filteredLeads]);

  const stageTotal = useMemo(() => {
    const map: Record<PipelineStage, number> = {
      New: 0,
      Contacted: 0,
      Proposal: 0,
      Closed: 0,
    };
    filteredLeads.forEach((l) => {
      if (map[l.stage] !== undefined) map[l.stage] += l.dealValue ?? 0;
    });
    return map;
  }, [filteredLeads]);

  const validateForm = useCallback(() => {
    const e: Partial<NewLeadForm> = {};
    if (!form.contactName.trim()) e.contactName = 'Contact name is required.';
    if (!form.dealValue.trim() || isNaN(Number(form.dealValue)))
      e.dealValue = 'Enter a valid deal value.';
    return e;
  }, [form]);

  const getOrCreateAgent = useCallback(() => {
    if (!currentUser) return '';
    const existing = agents.find((a) => a.email === currentUser.email);
    if (existing) return existing.id;
    const newAgent = addAgent({
      name: currentUser.name,
      email: currentUser.email,
    });
    return newAgent.id;
  }, [agents, addAgent, currentUser]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const errs = validateForm();
      if (Object.keys(errs).length) {
        setFormErrors(errs);
        toast.error('Please fill in all required fields.');
        return;
      }
      setFormErrors({});
      const agentId = getOrCreateAgent();
      addLead({
        contactName: form.contactName.trim(),
        company: form.company.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        dealValue: Number(form.dealValue),
        stage: form.stage,
        assignedAgentId: agentId,
        notes: form.notes.trim(),
      });
      setForm(EMPTY_FORM);
      setSheetOpen(false);
      toast.success('Deal added to your pipeline.');
    },
    [form, validateForm, getOrCreateAgent, addLead],
  );

  const handleDragStart = useCallback((e: React.DragEvent, leadId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    setDragLeadId(leadId);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, stage: PipelineStage) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setDragOverStage(stage);
    },
    [],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, stage: PipelineStage) => {
      e.preventDefault();
      if (dragLeadId) {
        moveLeadToStage(dragLeadId, stage);
      }
      setDragLeadId(null);
      setDragOverStage(null);
    },
    [dragLeadId, moveLeadToStage],
  );

  const handleDragEnd = useCallback(() => {
    setDragLeadId(null);
    setDragOverStage(null);
  }, []);

  const updateField = useCallback(
    <K extends keyof NewLeadForm>(key: K, value: NewLeadForm[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const totalPipelineValue = useMemo(
    () => leads.reduce((sum, l) => sum + (l.dealValue ?? 0), 0),
    [leads],
  );

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: 'var(--parchment)' }}
    >
      {/* Page header */}
      <div className="px-6 md:px-10 pt-8 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
          <div className="flex-1">
            <h1
              className="text-2xl md:text-3xl font-semibold text-foreground"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Deal Pipeline
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {leads.length} deal{leads.length !== 1 ? 's' : ''} · Total value:{' '}
              <span
                className="font-medium italic text-primary"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {formatCurrency(totalPipelineValue)}
              </span>
            </p>
          </div>
          <Button
            onClick={() => setSheetOpen(true)}
            className="font-semibold tracking-wide flex-shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={15} className="mr-2" />
            Add Deal
          </Button>
        </div>
        <div className="h-px bg-border mt-4" aria-hidden="true" />
      </div>

      {/* Search */}
      <div className="px-6 md:px-10 pb-4">
        <div className="relative max-w-xs">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts or companies…"
            className="pl-8 text-sm"
          />
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto px-4 md:px-6 pb-10">
        <div className="flex gap-4 min-w-[640px]">
          {STAGES.map((stage) => {
            const stageLeadList = stageLeads[stage] ?? [];
            const isDragTarget = dragOverStage === stage;

            return (
              <div
                key={stage}
                className="flex flex-col flex-1 min-w-[200px]"
                onDragOver={(e) => handleDragOver(e, stage)}
                onDrop={(e) => handleDrop(e, stage)}
                onDragLeave={() => setDragOverStage(null)}
              >
                {/* Column header */}
                <div
                  className="rounded-t-lg px-4 py-3 mb-2 border border-b-0 border-border"
                  style={{ background: 'var(--col-header-bg)' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="uppercase tracking-[0.08em] text-[0.68rem] font-semibold text-foreground/70">
                      {stage}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[0.68rem] font-semibold rounded-full px-2 py-0.5 bg-primary/15 text-primary">
                        {stageLeadList.length}
                      </span>
                    </div>
                  </div>
                  {stageLeadList.length > 0 && (
                    <p
                      className="text-[0.7rem] mt-0.5 italic font-medium text-primary"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {formatCurrency(stageTotal[stage])}
                    </p>
                  )}
                </div>

                {/* Drop zone */}
                <div
                  className={cn(
                    'flex-1 rounded-b-lg border border-border p-3 space-y-3 min-h-[200px]',
                    'transition-colors duration-[120ms]',
                    isDragTarget
                      ? 'bg-primary/6 border-primary/40'
                      : 'bg-card/60',
                  )}
                  style={isDragTarget ? { background: 'hsl(var(--primary) / 0.06)' } : {}}
                >
                  {stageLeadList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 px-3 text-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 bg-primary/8">
                        <ChevronDown
                          size={16}
                          className="text-primary/40"
                        />
                      </div>
                      <p
                        className="text-sm font-medium text-foreground/60 mb-1"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {STAGE_EMPTY[stage].heading}
                      </p>
                      <p className="text-[0.68rem] text-muted-foreground leading-snug">
                        {STAGE_EMPTY[stage].body}
                      </p>
                      {stage === 'New' && (
                        <button
                          onClick={() => setSheetOpen(true)}
                          className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-primary transition-colors duration-150 hover:underline"
                        >
                          Add your first deal
                        </button>
                      )}
                    </div>
                  ) : (
                    stageLeadList.map((lead) => (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        isDragging={dragLeadId === lead.id}
                        onDragStart={handleDragStart}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slide-in sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-foreground/40"
              onClick={() => setSheetOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[420px] flex flex-col shadow-2xl bg-card"
            >
              {/* Sheet header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-card z-10">
                <h2
                  className="text-xl font-semibold text-foreground"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  New Deal
                </h2>
                <button
                  onClick={() => setSheetOpen(false)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Close panel"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Sheet body */}
              <form
                id="new-lead-form"
                onSubmit={handleSubmit}
                noValidate
                className="flex-1 overflow-y-auto px-6 py-6 space-y-5"
              >
                <div>
                  <Label htmlFor="contactName" className={LABEL_CLASS}>
                    Contact Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="contactName"
                    value={form.contactName}
                    onChange={(e) => updateField('contactName', e.target.value)}
                    placeholder="e.g. Helena Voss"
                    className={formErrors.contactName ? 'border-destructive' : ''}
                  />
                  {formErrors.contactName && (
                    <p className="text-destructive text-xs mt-1">{formErrors.contactName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="company" className={LABEL_CLASS}>
                    Company
                  </Label>
                  <Input
                    id="company"
                    value={form.company}
                    onChange={(e) => updateField('company', e.target.value)}
                    placeholder="e.g. Meridian Capital"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="email" className={LABEL_CLASS}>
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="contact@co.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className={LABEL_CLASS}>
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="+1 555 000 0000"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="dealValue" className={LABEL_CLASS}>
                    Deal Value ($) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="dealValue"
                    type="number"
                    min="0"
                    step="1000"
                    value={form.dealValue}
                    onChange={(e) => updateField('dealValue', e.target.value)}
                    placeholder="e.g. 250000"
                    className={formErrors.dealValue ? 'border-destructive' : ''}
                  />
                  {formErrors.dealValue && (
                    <p className="text-destructive text-xs mt-1">{formErrors.dealValue}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="stage" className={LABEL_CLASS}>
                    Stage
                  </Label>
                  <div className="relative">
                    <select
                      id="stage"
                      value={form.stage}
                      onChange={(e) => updateField('stage', e.target.value as PipelineStage)}
                      className="w-full appearance-none bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-8"
                    >
                      {STAGES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className={LABEL_CLASS}>
                    Notes
                  </Label>
                  <textarea
                    id="notes"
                    value={form.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="Context, referral source, key requirements…"
                    rows={3}
                    className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                  />
                </div>
              </form>

              {/* Sheet footer */}
              <div className="px-6 py-4 border-t border-border flex gap-3 sticky bottom-0 bg-card">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSheetOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="new-lead-form"
                  className="flex-1 font-semibold tracking-wide bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Add Deal
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
