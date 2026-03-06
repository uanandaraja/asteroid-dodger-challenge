# Rotican.ai Next.js Starter

Next.js 16 + Tailwind v4 + shadcn/ui starter template.

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- shadcn/ui
- TypeScript

## Quick Start

```bash
npm run dev
```

## AI Agent Reference

### Add shadcn Components

```bash
npx shadcn add button card input badge
```

Use in code:
```tsx
import { Button } from "@/components/ui/button"
<Button>Label</Button>
```

### Modify Theme Colors

Edit `src/app/globals.css`:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  /* ... */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... */
}
```

Colors automatically map to Tailwind utilities via `@theme inline`.

### Key Files

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Main page |
| `src/app/globals.css` | Theme variables + Tailwind |
| `src/components/ui/` | shadcn components |
| `components.json` | shadcn config |

### Styling Rules

- Use semantic tokens: `bg-background`, `text-foreground`, `text-muted-foreground`
- Don't use `dark:` variants - handled by CSS variables
- Use `cn()` from `@/lib/utils` for conditional classes
