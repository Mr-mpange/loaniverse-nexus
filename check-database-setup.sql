-- Check if database is properly set up
-- Run this first to see what's missing

-- Check if required tables exist
SELECT 
  table_name,
  CASE WHEN table_name IS NOT NULL THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'user_roles', 'notifications', 'notification_settings')
ORDER BY table_name;

-- Check if app_role enum exists
SELECT 
  enumlabel as role_value
FROM pg_enum e
JOIN pg_type t ON e.enumtypid = t.oid
WHERE t.typname = 'app_role'
ORDER BY enumlabel;

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'user_roles')
ORDER BY tablename, policyname;

-- Quick summary
SELECT 
  'Database Setup Status' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_roles' AND table_schema = 'public')
    THEN '✅ Tables exist'
    ELSE '❌ Need to run setup script'
  END as status;