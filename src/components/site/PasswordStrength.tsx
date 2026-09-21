export function scorePassword(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}

const labels = ["Too weak", "Weak", "Fair", "Good", "Strong"];
const colors = [
  "bg-destructive",
  "bg-destructive/70",
  "bg-gold",
  "bg-navy/60",
  "bg-navy",
];

export function PasswordStrength({ value }: { value: string }) {
  if (!value) return null;
  const s = scorePassword(value);
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < s ? colors[s] : "bg-border"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Strength: <span className="font-medium text-navy">{labels[s]}</span>
      </p>
    </div>
  );
}
