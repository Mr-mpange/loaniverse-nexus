-- Assign roles to existing users in your database
-- This script will help you assign roles to users who have already signed up

-- First, let's see what users exist in your database
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name' as full_name,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- To assign a role to a specific user, use one of these commands:
-- Replace 'USER_ID_HERE' with the actual user ID from the query above

-- Example: Assign admin role
-- INSERT INTO user_roles (user_id, role) 
-- VALUES ('USER_ID_HERE', 'admin')
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Example: Assign loan_officer role
-- INSERT INTO user_roles (user_id, role) 
-- VALUES ('USER_ID_HERE', 'loan_officer')
-- ON CONFLICT (user_id) DO UPDATE SET role = 'loan_officer';

-- Example: Assign trader role
-- INSERT INTO user_roles (user_id, role) 
-- VALUES ('USER_ID_HERE', 'trader')
-- ON CONFLICT (user_id) DO UPDATE SET role = 'trader';

-- Example: Assign compliance_officer role
-- INSERT INTO user_roles (user_id, role) 
-- VALUES ('USER_ID_HERE', 'compliance_officer')
-- ON CONFLICT (user_id) DO UPDATE SET role = 'compliance_officer';

-- Quick assign for the first 4 users (uncomment and modify as needed)
/*
WITH first_users AS (
  SELECT id, email, ROW_NUMBER() OVER (ORDER BY created_at) as rn
  FROM auth.users
  LIMIT 4
)
INSERT INTO user_roles (user_id, role)
SELECT 
  id,
  CASE 
    WHEN rn = 1 THEN 'admin'::app_role
    WHEN rn = 2 THEN 'loan_officer'::app_role
    WHEN rn = 3 THEN 'trader'::app_role
    WHEN rn = 4 THEN 'compliance_officer'::app_role
  END as role
FROM first_users
ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
*/

-- Check current role assignments
SELECT 
  u.email,
  u.raw_user_meta_data->>'full_name' as full_name,
  ur.role,
  ur.created_at as role_assigned_at
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at DESC;