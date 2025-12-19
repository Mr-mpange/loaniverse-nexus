-- Debug user roles - check if roles were assigned correctly
-- Run this to see what's happening with user roles

-- Check all users and their roles
SELECT 
  u.id,
  u.email,
  p.full_name,
  ur.role,
  ur.created_at as role_assigned_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email IN ('k@gmail.com', 'k1@gmail.com', 'k2@gmail.com', 'k3@gmail.com')
ORDER BY u.email;

-- Check if user_roles table has any data at all
SELECT COUNT(*) as total_roles FROM user_roles;

-- Check the structure of user_roles table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_roles' AND table_schema = 'public';

-- Check if there are any constraints on user_roles
SELECT 
  tc.constraint_name, 
  tc.constraint_type,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'user_roles' AND tc.table_schema = 'public';

-- Test inserting a role manually (replace with actual user ID)
-- SELECT id FROM auth.users WHERE email = 'k@gmail.com' LIMIT 1;