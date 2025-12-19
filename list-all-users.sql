-- List all users with their roles and profile information
-- Run this in your Supabase SQL Editor

SELECT 
  u.id as user_id,
  u.email,
  u.raw_user_meta_data->>'full_name' as full_name,
  ur.role,
  p.avatar_url,
  u.created_at as user_created_at,
  ur.created_at as role_assigned_at,
  u.last_sign_in_at,
  u.email_confirmed_at,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN 'Confirmed'
    ELSE 'Pending'
  END as email_status
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- Count users by role
SELECT 
  COALESCE(ur.role::text, 'No Role') as role,
  COUNT(*) as user_count
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
GROUP BY ur.role
ORDER BY user_count DESC;

-- List users without roles (need role assignment)
SELECT 
  u.id as user_id,
  u.email,
  u.raw_user_meta_data->>'full_name' as full_name,
  u.created_at
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.role IS NULL
ORDER BY u.created_at DESC;

-- List recent user activity
SELECT 
  u.email,
  u.raw_user_meta_data->>'full_name' as full_name,
  ur.role,
  u.last_sign_in_at,
  CASE 
    WHEN u.last_sign_in_at > NOW() - INTERVAL '1 day' THEN 'Active Today'
    WHEN u.last_sign_in_at > NOW() - INTERVAL '7 days' THEN 'Active This Week'
    WHEN u.last_sign_in_at > NOW() - INTERVAL '30 days' THEN 'Active This Month'
    WHEN u.last_sign_in_at IS NULL THEN 'Never Signed In'
    ELSE 'Inactive'
  END as activity_status
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
ORDER BY u.last_sign_in_at DESC NULLS LAST;