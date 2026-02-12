"use client";

interface FollowUpChipsProps {
  questions: string[];
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export function FollowUpChips({ questions, onSelect, disabled }: FollowUpChipsProps) {
  if (questions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-2.5">
      {questions.map((q, i) => (
        <button
          key={i}
          type="button"
          onClick={() => !disabled && onSelect(q)}
          disabled={disabled}
          className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] text-foreground transition-all hover:border-primary/40 hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.97]"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
