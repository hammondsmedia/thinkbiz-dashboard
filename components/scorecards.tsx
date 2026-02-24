import { DollarSign, Users, Handshake, Heart } from "lucide-react";

interface ScorecardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  accentColor: string;
}

function Scorecard({ title, value, subtitle, icon, accentColor }: ScorecardProps) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${accentColor}14`, color: accentColor }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-card-foreground">
          {value}
        </p>
        {subtitle && (
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

export function Scorecards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Scorecard
        title="Total Revenue"
        value="$15,250"
        icon={<DollarSign className="h-5 w-5" />}
        accentColor="#4CAF50"
      />
      <Scorecard
        title="Visitors Brought"
        value="12"
        icon={<Users className="h-5 w-5" />}
        accentColor="#2196F3"
      />
      <Scorecard
        title="Total 1-on-1s"
        value="24"
        icon={<Handshake className="h-5 w-5" />}
        accentColor="#9C27B0"
      />
      <Scorecard
        title="Members Thanked"
        value="8"
        subtitle="for closed business"
        icon={<Heart className="h-5 w-5" />}
        accentColor="#FF9800"
      />
    </div>
  );
}
