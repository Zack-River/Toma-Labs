import { useCallback, useMemo, useState } from 'react';
import { BLEND_CONFIG, BODY_OPTIONS, GOALS, ROAST_OPTIONS, buildQuote, createDefaultDraft, getGoal, getGuide, getProfile, getReadableAddition, getStarterDraft } from '../lib/blend-rules.js';

const DRAFT_KEY = 'toma-blend-lab-draft-v1';

function readDraft() {
  const defaults = createDefaultDraft();
  try {
    const stored = localStorage.getItem(DRAFT_KEY);
    return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
  } catch {
    return defaults;
  }
}

function persistDraft(draft) {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch { /* Storage may be disabled. */ }
}

export function useBlendBuilder() {
  const [draft, setDraft] = useState(readDraft);
  const [previousDraft, setPreviousDraft] = useState(null);
  const [step, setStep] = useState('moment');

  const updateDraft = useCallback((changes) => {
    setDraft((current) => {
      const next = { ...current, ...changes };
      setPreviousDraft(current);
      persistDraft(next);
      return next;
    });
  }, []);

  const selectGoal = useCallback((goalId) => {
    const starter = getStarterDraft(goalId);
    setPreviousDraft(draft);
    setDraft(starter);
    persistDraft(starter);
  }, [draft]);

  const goal = getGoal(draft.goalId);
  const quote = useMemo(() => buildQuote(draft), [draft]);
  const guide = useMemo(() => getGuide(draft, previousDraft), [draft, previousDraft]);
  const profile = useMemo(() => getProfile(draft), [draft]);
  const labels = useMemo(() => ({
    body: BODY_OPTIONS.find((item) => item.id === draft.body)?.label || draft.body,
    roast: ROAST_OPTIONS.find((item) => item.id === draft.roast)?.label || draft.roast,
    addition: getReadableAddition(draft),
  }), [draft]);

  const reset = useCallback(() => {
    const next = createDefaultDraft();
    setPreviousDraft(draft);
    setDraft(next);
    persistDraft(next);
  }, [draft]);

  return { BLEND_CONFIG, BODY_OPTIONS, GOALS, ROAST_OPTIONS, draft, goal, guide, labels, profile, quote, reset, selectGoal, setStep, step, updateDraft };
}
