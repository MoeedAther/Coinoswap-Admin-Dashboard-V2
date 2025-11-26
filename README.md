# Coinoswap Admin Dashboard - Next.js Version

A modern, responsive admin dashboard for cryptocurrency exchange management built with Next.js and JavaScript.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React 18** - JavaScript library for building user interfaces
- **JavaScript** - Programming language (converted from TypeScript)
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable components built with Radix UI
- **TanStack React Query** - Data fetching and state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Lucide React** - Icon library
- **Recharts** - Chart library for data visualization
- **next-themes** - Dark mode support

## Features

- ✅ Modern Next.js App Router architecture
- ✅ Client-side authentication with session storage
- ✅ Protected routes with authentication guard
- ✅ Responsive sidebar navigation
- ✅ Dark mode support
- ✅ 50+ shadcn/ui components
- ✅ Form validation with React Hook Form and Zod
- ✅ Data visualization with Recharts
- ✅ Mobile-friendly responsive design

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository or navigate to the project directory:

\`\`\`bash
cd coinoswap-admin-dashboard-nextjs
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Run the development server:

\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Default Login Credentials

- **Email:** admin@coinoswap.com
- **Password:** admin123

## Project Structure

\`\`\`
coinoswap-admin-dashboard-nextjs/
├── app/                      # Next.js App Router pages
│   ├── layout.js            # Root layout with providers
│   ├── page.js              # Home page
│   ├── login/               # Login page
│   ├── dashboard/           # Dashboard page
│   ├── swap-coin/           # Swap coin page
│   ├── buy-coin/            # Buy coin page
│   ├── networks/            # Networks management
│   ├── transactions/        # Transactions page
│   ├── admin/               # Admin settings
│   ├── setting/             # General settings
│   ├── setting-exchange/    # Exchange settings
│   └── profile/             # User profile
├── components/              # Reusable components
│   ├── ui/                  # shadcn/ui components
│   ├── providers/           # Context providers
│   ├── DashboardLayout.js   # Main dashboard layout
│   ├── NavLink.js           # Navigation link component
│   └── ProtectedRoute.js    # Route protection wrapper
├── contexts/                # React contexts
│   └── AuthContext.js       # Authentication context
├── hooks/                   # Custom React hooks
│   ├── use-mobile.js        # Mobile detection hook
│   └── use-toast.js         # Toast notification hook
├── lib/                     # Utility libraries
│   └── utils.js             # Utility functions
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── jsconfig.json            # JavaScript configuration
└── package.json             # Dependencies and scripts
\`\`\`

## Available Routes

- `/` - Landing page
- `/login` - Login page
- `/dashboard` - Main dashboard (protected)
- `/swap-coin` - Coin swap management (protected)
- `/buy-coin` - Buy cryptocurrency (protected)
- `/networks` - Network management (protected)
- `/transactions` - Transaction history (protected)
- `/admin` - Admin controls (protected)
- `/setting` - General settings (protected)
- `/setting-exchange` - Exchange settings (protected)
- `/profile` - User profile (protected)

## Authentication

The app uses a simple client-side authentication system with sessionStorage. In production, you should replace this with a proper backend authentication system.

### How it works:

1. User logs in with credentials
2. Session data is stored in sessionStorage
3. Protected routes check for valid session
4. Logout clears the session and redirects to login

## Customization

### Colors

Edit the CSS variables in `app/globals.css` to customize the color scheme:

\`\`\`css
:root {
  --background: 0 0% 4%;
  --foreground: 45 100% 95%;
  --primary: 45 93% 47%;
  /* ... more colors */
}
\`\`\`

### Components

All UI components are located in `components/ui/` and can be customized as needed. They follow the shadcn/ui pattern.

### Layout

Modify `components/DashboardLayout.js` to customize the sidebar navigation, header, or overall layout structure.

## Migration from Vite + TypeScript

This project was migrated from a Vite + React + TypeScript setup to Next.js + JavaScript:

### Key Changes:

1. **Router**: React Router → Next.js App Router
2. **Language**: TypeScript → JavaScript
3. **Build Tool**: Vite → Next.js
4. **Navigation**: `useNavigate` → `useRouter` from next/navigation
5. **Links**: `<Link>` from react-router-dom → `<Link>` from next/link
6. **Client Components**: Added `"use client"` directive to interactive components

## Contributing

To add new pages or features:

1. Create a new folder in `app/` with a `page.js` file
2. Wrap protected pages with `<ProtectedRoute>`
3. Use `<DashboardLayout>` for consistent layout
4. Add navigation links in `components/DashboardLayout.js`

## License

This project is part of the Coinoswap platform.

## Support

For issues or questions, please contact the development team.
