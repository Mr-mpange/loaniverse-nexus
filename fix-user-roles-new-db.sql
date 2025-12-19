-- Fix user roles in the new Supabase database
-- This script will assign roles to existing users

-- Step 1: Check what users exist in the new database
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'full_name' as full_name,
  created_at 
FROM auth.users 
ORDER BY created_at;

-- Step 2: Check if user_roles table exists and has data
SELECT COUNT(*) as role_count FROM user_roles;

-- Step 3: Check if profiles table exists and has data  
SELECT COUNT(*) as profile_count FROM profiles;

-- Step 4: Assign roles to the first 4 users (modify as needed)
-- This will assign admin, loan_officer, trader, compliance_officer in order

WITH numbered_users AS (
  SELECT 
    id,
    email,
    ROW_NUMBER() OVER (ORDER BY created_at) as user_number
  FROM auth.users
  LIMIT 4
)
INSERT INTO user_roles (user_id, role, created_at)
SELECT 
  id,
  CASE 
    WHEN user_number = 1 THEN 'admin'::app_role
    WHEN user_number = 2 THEN 'loan_officer'::app_role  
    WHEN user_number = 3 THEN 'trader'::app_role
    WHEN user_number = 4 THEN 'compliance_officer'::app_role
  END as role,
  NOW()
FROM numbered_users
ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;

-- Step 5: Create/update profiles for users
WITH numbered_users AS (
  SELECT 
    id,
    email,
    raw_user_meta_data->>'full_name' as existing_name,
    ROW_NUMBER() OVER (ORDER BY created_at) as user_number
  FROM auth.users
  LIMIT 4
)
INSERT INTO profiles (id, full_name, created_at, updated_at)
SELECT 
  id,
  COALESCE(
    existing_name,
    CASE 
      WHEN user_number = 1 THEN 'Admin User'
      WHEN user_number = 2 THEN 'Loan Officer'  
      WHEN user_number = 3 THEN 'Trader User'
      WHEN user_number = 4 THEN 'Compliance Officer'
    END
  ) as full_name,
  NOW(),
  NOW()
FROM numbered_users
ON CONFLICT (id) DO UPDATE SET 
  full_name = COALESCE(profiles.full_name, EXCLUDED.full_name),
  updated_at = NOW();

-- Step 6: Verify the assignments
SELECT 
  u.email,
  p.full_name,
  ur.role,
  ur.created_at as role_assigned_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at;

-- Step 7: Show role distribution
SELECT 
  COALESCE(ur.role::text, 'No Role') as role,
  COUNT(*) as user_count
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
GROUP BY ur.role
ORDER BY user_count DESC;