-- Diagnose what's actually in the database
-- Run this to see what exists

-- 1. Check what tables exist in public schema
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Check what types/enums exist
SELECT 
  t.typname as type_name,
  t.typtype as type_type,
  CASE 
    WHEN t.typtype = 'e' THEN 'ENUM'
    WHEN t.typtype = 'b' THEN 'BASE'
    WHEN t.typtype = 'c' THEN 'COMPOSITE'
    ELSE t.typtype::text
  END as type_description
FROM pg_type t
WHERE t.typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY t.typname;

-- 3. If app_role enum exists, show its values
SELECT 
  e.enumlabel as enum_value
FROM pg_enum e
JOIN pg_type t ON e.enumtypid = t.oid
WHERE t.typname = 'app_role'
ORDER BY e.enumsortorder;

-- 4. Check if user_roles table structure (if it exists)
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'user_roles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Check RLS policies (if table exists)
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'user_roles' 
  AND schemaname = 'public';

-- 6. Try to count rows in user_roles (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_roles' AND table_schema = 'public') THEN
        RAISE NOTICE 'user_roles table exists, checking row count...';
        PERFORM * FROM user_roles LIMIT 1;
        RAISE NOTICE 'user_roles table is accessible';
    ELSE
        RAISE NOTICE 'user_roles table does NOT exist';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error accessing user_roles table: %', SQLERRM;
END $$;