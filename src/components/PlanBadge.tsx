import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap, User } from 'lucide-react';
import type { PlanType } from '@/lib/pricing';

interface PlanBadgeProps {
  plan: PlanType;
  showLink?: boolean;
  size?: 'sm' | 'md';
}

export function PlanBadge({ plan, showLink = true, size = 'sm' }: PlanBadgeProps) {
  const config = {
    free: {
      label: 'Free',
      icon: User,
      className: 'bg-muted text-muted-foreground border-border',
    },
    plus: {
      label: 'Plus',
      icon: Zap,
      className: 'bg-primary/10 text-primary border-primary/20',
    },
    pro: {
      label: 'Pro',
      icon: Crown,
      className: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    },
  };

  const { label, icon: Icon, className } = config[plan];

  const badge = (
    <Badge
      variant="outline"
      className={`${className} gap-1 font-semibold ${
        size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'
      }`}
    >
      <Icon className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      {label}
    </Badge>
  );

  if (showLink) {
    return (
      <Link to="/dashboard" className="hover:opacity-80 transition-opacity">
        {badge}
      </Link>
    );
  }

  return badge;
}
