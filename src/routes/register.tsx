import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Loader2, Mail, Lock, User, Phone, Cake } from "lucide-react";
import { toast } from "sonner";

import { AuthLayout } from "@/components/site/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrength, scorePassword } from "@/components/site/PasswordStrength";
import { SocialAuthButtons } from "@/components/site/SocialAuthButtons";
import { register } from "@/lib/auth-api";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account · NumLab" },
      { name: "description", content: "Create your NumLab student account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RegisterPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z
    .string()
    .trim()
    .min(6, "Enter a valid phone number")
    .max(20, "Phone is too long")
    .regex(/^[+()\d\s-]+$/, "Only digits, spaces and + ( ) -"),
  birthday: z
    .string()
    .min(1, "Select your birthday")
    .refine((v) => {
      const d = new Date(v);
      if (Number.isNaN(d.getTime())) return false;
      const age = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      return age >= 10 && age <= 100;
    }, "Enter a realistic birthday"),
  password: z.string().min(8, "At least 8 characters"),
});

function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    birthday: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const issue of parsed.error.issues) fe[issue.path[0] as string] = issue.message;
      setErrors(fe);
      return;
    }
    if (scorePassword(form.password) < 2) {
      setErrors({ password: "Choose a stronger password." });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await register(form);
      setAuth(res.token, res.user);
      toast.success("Account created — welcome to NumLab!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join students and lecturers using NumLab every day."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <SocialAuthButtons label="Sign up with" />

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Field
          id="name"
          label="Full name"
          icon={User}
          placeholder="Ada Lovelace"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
          error={errors.name}
        />

        <Field
          id="email"
          type="email"
          label="Email"
          icon={Mail}
          placeholder="you@esprit.tn"
          autoComplete="email"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
          error={errors.email}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="phone"
            type="tel"
            label="Phone"
            icon={Phone}
            placeholder="+216 55 555 555"
            autoComplete="tel"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
            error={errors.phone}
          />
          <Field
            id="birthday"
            type="date"
            label="Birthday"
            icon={Cake}
            value={form.birthday}
            onChange={(v) => setForm({ ...form, birthday: v })}
            error={errors.birthday}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              className="pl-9"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              aria-invalid={!!errors.password}
            />
          </div>
          <PasswordStrength value={form.password} />
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>

        <p className="text-xs text-muted-foreground">
          By continuing you agree to NumLab's{" "}
          <a href="#" className="underline">Terms</a> and{" "}
          <a href="#" className="underline">Privacy Policy</a>.
        </p>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full bg-[image:var(--gradient-brand)] text-brand-foreground shadow-[var(--shadow-glow)] hover:opacity-95"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}

function Field({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          type={type}
          className="pl-9"
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
