-- Create a test user and assign admin role
-- Note: This creates the user record, but you'll still need to set a password through the dashboard

-- First, make sure the tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('profiles', 'user_roles');

-- If tables don't exist, you need to run the setup script first
-- Then create a test user profile and role (replace with actual user ID from auth.users)

-- Example (uncomment and replace USER_ID after creating user in dashboard):
/*
INSERT INTO profiles (id, full_name, created_at, updated_at) 
VALUES ('USER_ID_HERE', 'Test Admin', NOW(), NOW());

INSERT INTO user_roles (user_id, role, created_at) 
VALUES ('USER_ID_HERE', 'admin', NOW());
*/