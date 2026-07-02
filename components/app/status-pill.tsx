import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "success" | "accent" | "destructive" | "warning" | "muted";

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary-soft text-primary border-primary/15",
  success:
    "bg-[oklch(0.94_0.05_158)] text-[oklch(0.34_0.09_158)] border-[oklch(0.34_0.09_158)]/15 dark:bg-[oklch(0.3_0.06_158)] dark:text-[oklch(0.88_0.1_158)] dark:border-[oklch(0.88_0.1_158)]/20",
  accent: "bg-accent text-accent-foreground border-accent-foreground/15",
  destructive:
    "bg-[oklch(0.95_0.04_27)] text-[oklch(0.45_0.18_27)] border-[oklch(0.45_0.18_27)]/15 dark:bg-[oklch(0.3_0.08_27)] dark:text-[oklch(0.85_0.15_27)] dark:border-[oklch(0.85_0.15_27)]/20",
  warning:
    "bg-[oklch(0.96_0.07_75)] text-[oklch(0.4_0.1_60)] border-[oklch(0.4_0.1_60)]/15 dark:bg-[oklch(0.32_0.07_70)] dark:text-[oklch(0.9_0.13_75)]",
  muted: "bg-muted text-muted-foreground border-border",
};

export function StatusPill({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-tight capitalize",
        toneClasses[tone],
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          tone === "primary" && "bg-primary",
          tone === "success" && "bg-[oklch(0.55_0.13_158)]",
          tone === "accent" && "bg-[oklch(0.65_0.14_70)]",
          tone === "destructive" && "bg-[oklch(0.6_0.2_27)]",
          tone === "warning" && "bg-[oklch(0.7_0.14_75)]",
          tone === "muted" && "bg-muted-foreground/50",
        )}
      />
      {children}
    </span>
  );
}
