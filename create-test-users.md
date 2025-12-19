# Create Test Users for LMA NEXUS

Since Supabase handles user creation through the authentication system, you'll need to create test users through the application's signup process or the Supabase dashboard.

## Option 1: Create Users Through the Application

1. Go to http://localhost:8082/auth
2. Click on "Sign Up" tab
3. Create users with these details:

### Admin User
- **Email**: admin@lmanexus.com
- **Password**: Admin123!
- **Full Name**: John Admin
- **Role**: Administrator

### Loan Officer User
- **Email**: sarah@lmanexus.com
- **Password**: Loan123!
- **Full Name**: Sarah Johnson
- **Role**: Loan Officer

### Trader User
- **Email**: mike@lmanexus.com
- **Password**: Trade123!
- **Full Name**: Mike Trader
- **Role**: Trader

### Compliance Officer User
- **Email**: lisa@lmanexus.com
- **Password**: Comply123!
- **Full Name**: Lisa Compliance
- **Role**: Compliance Officer

## Option 2: Use Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add user" and create users manually
4. Then run the `assign-roles-to-existing-users.sql` script to assign roles

## Option 3: Assign Roles to Existing Users

If you already have users in your database:

1. Run the first query in `assign-roles-to-existing-users.sql` to see existing users
2. Copy the user IDs
3. Use the INSERT statements to assign roles to specific users

## Testing the Application

Once you have users with different roles, you can:

1. **Login as Admin** - Access all features including user management and settings
2. **Login as Loan Officer** - Access loan management, documents, and lifecycle features
3. **Login as Trader** - Access trading board and market analytics
4. **Login as Compliance Officer** - Access compliance engine, audit logs, and ESG features

Each role will see a different dashboard and have access to different navigation items based on their permissions.