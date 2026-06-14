import { Infinity as InfinityIcon } from 'lucide-react';

interface UsageBarProps {
  used: number;
  limit: number | null;
  label: string;
  className?: string;
}

export function UsageBar({ used, limit, label, className = '' }: UsageBarProps) {
  const isUnlimited = limit === null;
  // Handle negative values (bonus scans carried forward from free plan)
  const displayUsed = Math.max(0, used);
  const percentage = isUnlimited ? 0 : Math.min(100, Math.max(0, (used / limit) * 100));
  const remaining = isUnlimited ? null : Math.max(0, limit - used);
  
  // Color based on usage
  const getProgressColor = () => {
    if (isUnlimited) return 'bg-primary';
    if (percentage >= 100) return 'bg-destructive';
    if (percentage >= 80) return 'bg-amber-500';
    return 'bg-primary';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">
          {isUnlimited ? (
            <span className="flex items-center gap-1">
              <InfinityIcon className="w-4 h-4" />
              Unlimited
            </span>
          ) : (
            <>
              <span className="font-semibold text-foreground">{displayUsed}</span>
              <span className="text-muted-foreground"> / {limit}</span>
            </>
          )}
        </span>
      </div>
      
      {!isUnlimited && (
        <>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${getProgressColor()}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {remaining === 0 ? (
              <span className="text-destructive font-medium">Limit reached</span>
            ) : (
              <>{remaining} remaining this month</>
            )}
          </p>
        </>
      )}
    </div>
  );
}
