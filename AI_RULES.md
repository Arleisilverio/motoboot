# Motoboot — AI Development Rules

## Tech Stack
- **Next.js 16 (App Router)**: Core framework for routing, server components, and optimized rendering.
- **React 19**: Modern UI library utilizing the latest hooks and concurrent features.
- **TypeScript**: Strict type safety across the entire application for maintainability.
- **Supabase (SSR)**: Backend-as-a-Service for Authentication, PostgreSQL Database, and Realtime Presence.
- **Tailwind CSS**: Primary utility-first styling engine for responsive and rapid UI development.
- **Lucide React**: Standardized icon library for consistent and accessible iconography.
- **Framer Motion**: High-performance animation library for fluid UI transitions and micro-interactions.
- **Leaflet & React Leaflet**: Interactive mapping solution for real-time location tracking and geocoding.
- **Shadcn/UI**: Accessible, Radix-based UI components for a premium and consistent look.

## Library Usage Rules

### 1. Icons
- **Rule**: Always use `lucide-react`.
- **Usage**: Do not import raw SVGs or use other icon sets unless a specific brand logo is required.

### 2. Animations
- **Rule**: Use `framer-motion`.
- **Usage**: All page transitions, modal entries, and hover effects should utilize Framer Motion for a "premium" feel.

### 3. Maps
- **Rule**: Use `react-leaflet`.
- **Usage**: Since Leaflet requires the `window` object, always wrap map components in a dynamic import with `ssr: false` (see `src/components/MapWrapper.tsx`).

### 4. Backend & Auth
- **Rule**: Use `@supabase/ssr`.
- **Usage**: Follow the established patterns in `src/lib/supabase/` for client-side (`getSupabaseClient`) and server-side (`getSupabaseServerClient`) interactions.

### 5. Styling
- **Rule**: Tailwind CSS + Design Tokens.
- **Usage**: Prefer Tailwind utility classes. For complex component-specific logic, use CSS Modules (`.module.css`) while referencing the design tokens defined in `src/app/globals.css`.

### 6. UI Components
- **Rule**: Shadcn/UI (Radix UI).
- **Usage**: Use Shadcn components for standard elements like Buttons, Inputs, and Cards to maintain the project's design system.

### 7. State Management
- **Rule**: React Context API.
- **Usage**: Use Context Providers for global state (e.g., `AuthProvider`, `RadioProvider`). Avoid adding heavy state management libraries like Redux or Zustand unless the complexity significantly increases.

### 8. Realtime
- **Rule**: Supabase Realtime (Presence).
- **Usage**: Use the Presence channel for location sharing and online status as implemented in `src/services/locationService.ts`.