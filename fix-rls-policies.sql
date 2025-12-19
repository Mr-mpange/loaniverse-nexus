-- Fix the circular dependency in RLS policies
-- The current policies are causing the 500 error

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own role" ON user_roles;
DROP POLICY IF EXISTS "Users can insert own role" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can update all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;

-- Create simple, working policies without circular dependencies
CREATE POLICY "Users can view own role" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own role" ON user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own role" ON user_roles
  FOR UPDATE USING (auth.uid() = user_id);

-- For now, let's not have admin-specific policies to avoid circular dependency
-- We can add them later with a different approach

-- Verify the policies
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'user_roles' 
  AND schemaname = 'public'
ORDER BY policyname;

-- Check if the user has a role assigned
SELECT 
  ur.user_id,
  ur.role,
  ur.created_at
FROM user_roles ur
WHERE ur.user_id = '898e7228-68ae-4d3f-957d-4c9268311e5c';

-- If no role exists, insert one
INSERT INTO user_roles (user_id, role, created_at)
SELECT '898e7228-68ae-4d3f-957d-4c9268311e5c', 'admin', NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = '898e7228-68ae-4d3f-957d-4c9268311e5c'
);

-- Final verification
SELECT 
  u.email,
  ur.role,
  'Should work now!' as status
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
WHERE u.id = '898e7228-68ae-4d3f-957d-4c9268311e5c';