-- Emergency setup for user_roles table
-- Run this if you're getting 500 errors

-- Check if user_roles table exists
SELECT 
  table_name,
  table_schema
FROM information_schema.tables 
WHERE table_name = 'user_roles';

-- Check if app_role enum exists
SELECT 
  t.typname as enum_name,
  array_agg(e.enumlabel ORDER BY e.enumsortorder) as enum_values
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid 
WHERE t.typname = 'app_role'
GROUP BY t.typname;

-- Create app_role enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE app_role AS ENUM ('admin', 'loan_officer', 'trader', 'compliance_officer');
        RAISE NOTICE 'Created app_role enum';
    ELSE
        RAISE NOTICE 'app_role enum already exists';
    END IF;
END $$;

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_roles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view own role" ON user_roles;
CREATE POLICY "Users can view own role" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own role" ON user_roles;
CREATE POLICY "Users can insert own role" ON user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add unique constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'user_roles' 
        AND constraint_type = 'UNIQUE' 
        AND constraint_name LIKE '%user_id%'
    ) THEN
        ALTER TABLE user_roles ADD CONSTRAINT user_roles_user_id_unique UNIQUE (user_id);
        RAISE NOTICE 'Added unique constraint on user_id';
    ELSE
        RAISE NOTICE 'Unique constraint already exists';
    END IF;
END $$;

-- Delete any existing role for this user first
DELETE FROM user_roles WHERE user_id = '898e7228-68ae-4d3f-957d-4c9268311e5c';

-- Now assign a role to the current user (k@gmail.com)
INSERT INTO user_roles (user_id, role, created_at)
VALUES ('898e7228-68ae-4d3f-957d-4c9268311e5c', 'admin', NOW());

-- Verify the setup
SELECT 
  'Setup completed!' as status,
  COUNT(*) as roles_assigned
FROM user_roles;

-- Check the specific user
SELECT 
  u.email,
  ur.role,
  ur.created_at
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.id = '898e7228-68ae-4d3f-957d-4c9268311e5c';