# Study Buddy

A modern task management app for students to organize assignments, track progress, and stay on top of deadlines.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-blue?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green?logo=supabase)

## Features

- 📚 **Course Management** - Organize tasks by courses with custom colors
- ✅ **Task Tracking** - Move tasks through Todo → In Progress → Done
- ⏱️ **Time Tracking** - Automatic time tracking when tasks are in progress
- 📅 **Due Dates** - Never miss a deadline with date tracking
- 🎨 **Multiple Themes** - Choose from Violet, Ocean, Forest, Sunset, and Rose color themes
- 🌙 **Dark Mode** - Light, dark, or system theme preference
- 🔐 **Authentication** - Secure login with Supabase Auth
- 📱 **Responsive** - Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth)
- **State Management**: React Context + Hooks

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (optional - app works with mock data without it)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gitKheang/Study-Buddy.git
   cd Study-Buddy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. (Optional) Set up Supabase database:
   - Create a new Supabase project
   - Run the SQL from `supabase-schema.sql` in the SQL editor

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable UI components
│   └── ui/         # shadcn/ui components
├── hooks/          # Custom React hooks
├── lib/            # Utilities and API
├── pages/          # Page components
└── types/          # TypeScript types
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

> **Note**: The app works without Supabase using mock data for testing.

## License

MIT

## Author

Built with ❤️ by Kheang
