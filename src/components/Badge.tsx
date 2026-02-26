'use client';

type BadgeVariant = 'yes' | 'no' | 'partial' | 'new';

const variantStyles: Record<BadgeVariant, string> = {
  yes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  no: 'bg-red-500/15 text-red-400 border-red-500/30',
  partial: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  new: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
};

const variantLabels: Record<BadgeVariant, string> = {
  yes: '対応',
  no: '非対応',
  partial: '一部対応',
  new: 'NEW',
};

export default function Badge({
  variant,
  label,
}: {
  variant: BadgeVariant;
  label?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-mono font-medium ${variantStyles[variant]}`}
    >
      {label || variantLabels[variant]}
    </span>
  );
}
