# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Router DOM
- Supabase (Authentication & Database)
- Tanstack Query

## Application Structure

### Role-Based Routing

The application implements role-based routing with dedicated dashboards for each user role:

- **Admin Dashboard** (`/admin`) - Full system access with all modules
- **Loan Officer Dashboard** (`/loan-officer`) - Loan management and documentation
- **Trader Dashboard** (`/trader`) - Trading board and market analytics
- **Compliance Dashboard** (`/compliance`) - Regulatory oversight and audit tools

### Authentication & Authorization

- Users are automatically redirected to their role-specific dashboard upon login
- Route protection ensures users can only access authorized sections
- Admins have access to all dashboards and can switch between role views
- Role-based sidebar navigation shows relevant modules for each user type

### Key Features

- **Role-based Access Control**: Each role has specific permissions and dashboard views
- **Dynamic Navigation**: Sidebar adapts to show relevant modules based on user role
- **Admin Role Switching**: Admins can view the application from any role's perspective
- **Protected Routes**: Unauthorized access attempts are blocked with appropriate messaging
- **Role Selection**: New users can select their role on first login

## Database Setup

The application uses Supabase for authentication and database management.

### Setup Instructions

1. **Create a Supabase project** at https://supabase.com
2. **Configure environment variables** in `.env`:
   ```
   VITE_SUPABASE_PROJECT_ID="your-project-id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-public-key"
   VITE_SUPABASE_URL="https://your-project-id.supabase.co"
   ```
3. **Run the migration** in your Supabase SQL Editor:
   - Copy the contents of `supabase/migrations/20241219000000_setup_user_roles.sql`
   - Paste and run in your Supabase project's SQL Editor
4. **Configure CORS** in Supabase Dashboard:
   - Go to Settings → API
   - Add `http://localhost:8082` to CORS origins

### User Management

- **First user** created through signup will need a role assigned manually
- **Subsequent users** can be assigned roles through the admin interface
- **Roles available**: Admin, Loan Officer, Trader, Compliance Officer

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
