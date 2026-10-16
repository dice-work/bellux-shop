import type { ReactNode } from "react";
import { Sparkle } from "./Sparkle";

export function SectionHeading({ badge, title, children }: { badge: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="badge">
        <Sparkle className="h-3 w-3 text-fg" />
        {badge}
      </span>
      <h2 className="text-chrome mt-5 text-3xl leading-tight font-semibold tracking-tight sm:text-5xl">{title}</h2>
      {children && <p className="mt-4 text-sm leading-relaxed text-mute sm:text-base">{children}</p>}
    </div>
  );
}
