# Migration Guide: Vite + TypeScript to Next.js + JavaScript

This project has been partially migrated from Vite + React + TypeScript to Next.js + JavaScript.

## Migration Status

### ✅ Completed
- Project structure created
- Next.js configuration files
- Tailwind CSS setup
- Package.json with all dependencies
- Root layout with providers
- Authentication context adapted for Next.js
- Main pages created (Home, Login, Dashboard, etc.)
- Dashboard layout component
- Navigation components

### ⚠️ Needs Attention
- UI components need to be regenerated or manually converted from TypeScript

## How to Complete the Migration

### Option 1: Use shadcn CLI (Recommended)

1. Initialize shadcn in the project:
\`\`\`bash
cd coinoswap-admin-dashboard-nextjs
npx shadcn@latest init
\`\`\`

Configure with these settings:
- TypeScript: No
- Style: Default
- Base color: Slate
- CSS variables: Yes
- Import alias: @/*
- React Server Components: Yes

2. Add the required components:
\`\`\`bash
npx shadcn@latest add button card input label sheet toast toaster sonner tooltip select popover calendar
\`\`\`

3. For each additional UI component needed, run:
\`\`\`bash
npx shadcn@latest add [component-name]
\`\`\`

### Option 2: Manual Conversion

For each TypeScript component in the original project (`Coinoswap-Admin-Dashboard-V2/src/components/ui/*.tsx`):

1. Remove type annotations
2. Change file extension from `.tsx` to `.js`
3. Add `"use client"` directive at the top
4. Replace `React.FC<Props>` with just function parameters
5. Remove interface definitions
6. Replace `React.forwardRef<HTMLElement, Props>` with `React.forwardRef`

Example conversion:
\`\`\`typescript
// Before (TypeScript)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", ...props }, ref) => {
    // ...
  }
);
\`\`\`

\`\`\`javascript
// After (JavaScript)
"use client";

const Button = React.forwardRef(
  ({ variant = "default", ...props }, ref) => {
    // ...
  }
);
\`\`\`

## Testing the Application

Once UI components are properly set up:

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

## Key Differences from Original

1. **Routing**: React Router replaced with Next.js App Router
   - `useNavigate()` → `useRouter()` from `next/navigation`
   - `<Link to="">` → `<Link href="">`  from `next/link`
   - File-based routing instead of route configuration

2. **Client/Server Components**: Next.js uses Server Components by default
   - Interactive components need `"use client"` directive
   - All components with hooks, state, or event handlers are client components

3. **Authentication**: Modified to use Next.js navigation
   - `useRouter` from `next/navigation` instead of `react-router-dom`
   - `router.push()` instead of `navigate()`

4. **No TypeScript**: All type annotations removed
   - PropTypes could be added for runtime checking if desired
   - JSDoc comments can provide editor hints

## Troubleshooting

### Build Errors
If you encounter build errors related to UI components:
1. Delete `components/ui` folder
2. Run shadcn init and add components fresh
3. Ensure all components have `"use client"` directive

### Import Errors
- Check that `jsconfig.json` has the correct path alias
- Verify all imports use `@/` prefix correctly

### Hydration Errors
- Ensure client components have `"use client"` directive
- Check for mismatches between server and client rendering

## Next Steps

1. Complete UI component setup (see Options above)
2. Test all routes and functionality
3. Migrate any remaining business logic from original project
4. Add environment variables for API endpoints
5. Implement proper backend authentication
6. Deploy to Vercel or your hosting platform

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
