# Ahti POC Template for Claude

This project is a reusable starting point for Ahti Consulting proof-of-concept applications.

## Purpose

Use this repo as a clean shell that already follows the Ahti visual system:

- blue gradient background
- centered white card container
- left sidebar for navigation
- main content area for the actual POC UI
- typography and spacing based on the shared design tokens

The goal is to keep the product shell consistent while leaving the business-specific UI entirely open for rapid prototyping.

## Design system to reuse

Use the existing files as the source of truth:

- `src/theme.ts` for colors, spacing, font styles, and responsive breakpoints
- `src/components/common-styled-components.tsx` for reusable layout and typography primitives like `ContainerCard`, `PageContent`, `PageTitle`, `SectionTitle`, `LeadText`, and `P`

Do not invent a new visual language unless the client specifically asks for it.

## What this template already contains

The current app shell in `src/App.tsx` includes:

- a blue gradient full-page background
- a rounded white card container with soft shadow
- a two-column layout: sidebar + main panel
- a header bar with a neutral Ahti-style treatment
- placeholder content blocks that act as scaffolding for your actual POC

This is intentionally an empty canvas, not a finished feature.

## How to use Claude with this template

When starting a new POC, ask Claude to work within this structure and keep the design system intact.

Use a prompt like this:

```
Create an Ahti Consulting POC app using the existing shell in this repo.

Requirements:
- keep the overall layout and styling from src/App.tsx
- reuse the tokens from src/theme.ts
- use the shared styled components from src/components/common-styled-components.tsx
- do not replace the shell structure unless absolutely required
- keep the POC visually aligned with Ahti branding and consulting app patterns
- replace the placeholder sections with real feature content for [describe your use case]
- keep the app responsive and mobile-friendly
- do not add unrelated libraries unless strictly needed

Focus on:
- a simple, business-focused UI
- clear sections for inputs, calculations, outputs, and assumptions
- good spacing and typography using the shared theme tokens
```

## Working rules for Claude

When editing this project, Claude should:

1. Preserve the page shell and Ahti layout.
2. Reuse `theme.colors`, `theme.spacing()`, and `theme.font*` helpers instead of hardcoded values.
3. Prefer `PageContent`, `SectionTitle`, `LeadText`, `P`, `ContainerCard`, and related primitives from the common styled components file.
4. Keep placeholder cards or sections only until the actual POC content is built.
5. Maintain consistency with the existing design language.
6. Avoid unnecessary complexity; the purpose is a rapid proof of concept, not a production app.

## Typical POC structure

For each new app, keep this pattern:

- `src/App.tsx`: main container and layout shell
- `src/theme.ts`: design tokens and breakpoints
- `src/components/common-styled-components.tsx`: reusable styling blocks
- feature-specific components added under `src/components/...` or `src/...`

## Default expectation

The default app should remain intentionally empty enough to act as a canvas for the next POC, while still feeling like an Ahti Consulting product demo.
