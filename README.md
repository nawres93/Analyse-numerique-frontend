# NumLab

NumLab is a modern numerical analysis learning platform built with React, TypeScript, and Vite. It combines a premium landing experience, guided learning modules, interactive visualizations, student analytics, and timed quizzes into a single polished SPA.

## What’s Included

- Animated landing page with a 3D hero scene
- Sign in, sign up, password recovery, and email verification flows
- Dashboard with progress tracking and learning stats
- Module detail pages for numerical methods
- Interactive analytics page with charts and achievements
- Timed quiz page with scoring and feedback
- Admin area for platform management

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- TanStack Router routes
- Tailwind CSS
- shadcn/ui style components
- Recharts
- React Three Fiber / Drei

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Main Routes

- `/` - public landing page
- `/login` - sign in
- `/register` - sign up
- `/forgot-password` - password recovery
- `/reset-password` - password reset
- `/verify-email` - email verification
- `/admin` - admin dashboard
- `/dashboard` - student dashboard
- `/dashboard/modules` - module library
- `/dashboard/modules/:slug` - module detail page
- `/dashboard/analytics` - analytics and achievements
- `/dashboard/quiz` - timed quiz experience

## Notes

- The project is set up as a private GitHub repository.
- Quiz results and learning state are currently handled on the client side.
- Some content uses mock data so the UI can be explored immediately without a backend.

## License

Private project.
