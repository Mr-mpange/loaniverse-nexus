-- Update existing users with full names and assign roles
-- This script will update the 4 users you have: k@gmail.com, k1@gmail.com, k2@gmail.com, k3@gmail.com

-- First, let's get the user IDs for these emails
WITH user_emails AS (
  SELECT id, email, ROW_NUMBER() OVER (ORDER BY email) as rn
  FROM auth.users 
  WHERE email IN ('k@gmail.com', 'k1@gmail.com', 'k2@gmail.com', 'k3@gmail.com')
)
SELECT id, email, rn FROM user_emails ORDER BY email;

-- Update profiles with full names
-- k@gmail.com -> John Admin (Admin)
UPDATE profiles 
SET full_name = 'John Admin', updated_at = NOW()
WHERE id = (SELECT id FROM auth.users WHERE email = 'k@gmail.com');

-- k1@gmail.com -> Sarah Johnson (Loan Officer)  
UPDATE profiles 
SET full_name = 'Sarah Johnson', updated_at = NOW()
WHERE id = (SELECT id FROM auth.users WHERE email = 'k1@gmail.com');

-- k2@gmail.com -> Mike Trader (Trader)
UPDATE profiles 
SET full_name = 'Mike Trader', updated_at = NOW()
WHERE id = (SELECT id FROM auth.users WHERE email = 'k2@gmail.com');

-- k3@gmail.com -> Lisa Compliance (Compliance Officer)
UPDATE profiles 
SET full_name = 'Lisa Compliance', updated_at = NOW()
WHERE id = (SELECT id FROM auth.users WHERE email = 'k3@gmail.com');

-- Insert profiles if they don't exist
INSERT INTO profiles (id, full_name, created_at, updated_at)
SELECT u.id, 
       CASE 
         WHEN u.email = 'k@gmail.com' THEN 'John Admin'
         WHEN u.email = 'k1@gmail.com' THEN 'Sarah Johnson'
         WHEN u.email = 'k2@gmail.com' THEN 'Mike Trader'
         WHEN u.email = 'k3@gmail.com' THEN 'Lisa Compliance'
       END as full_name,
       NOW(), NOW()
FROM auth.users u
WHERE u.email IN ('k@gmail.com', 'k1@gmail.com', 'k2@gmail.com', 'k3@gmail.com')
  AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = u.id);

-- Delete existing roles first (if any)
DELETE FROM user_roles 
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('k@gmail.com', 'k1@gmail.com', 'k2@gmail.com', 'k3@gmail.com')
);

-- Assign roles to users
-- k@gmail.com -> admin
INSERT INTO user_roles (user_id, role, created_at)
SELECT id, 'admin'::app_role, NOW()
FROM auth.users 
WHERE email = 'k@gmail.com';

-- k1@gmail.com -> loan_officer
INSERT INTO user_roles (user_id, role, created_at)
SELECT id, 'loan_officer'::app_role, NOW()
FROM auth.users 
WHERE email = 'k1@gmail.com';

-- k2@gmail.com -> trader
INSERT INTO user_roles (user_id, role, created_at)
SELECT id, 'trader'::app_role, NOW()
FROM auth.users 
WHERE email = 'k2@gmail.com';

-- k3@gmail.com -> compliance_officer
INSERT INTO user_roles (user_id, role, created_at)
SELECT id, 'compliance_officer'::app_role, NOW()
FROM auth.users 
WHERE email = 'k3@gmail.com';

-- Verify the updates
SELECT 
  u.email,
  p.full_name,
  ur.role,
  u.created_at as user_created,
  ur.created_at as role_assigned
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email IN ('k@gmail.com', 'k1@gmail.com', 'k2@gmail.com', 'k3@gmail.com')
ORDER BY u.email;

-- Display success message
SELECT 'Users updated successfully!' as status,
       'k@gmail.com = John Admin (Admin)' as user1,
       'k1@gmail.com = Sarah Johnson (Loan Officer)' as user2,
       'k2@gmail.com = Mike Trader (Trader)' as user3,
       'k3@gmail.com = Lisa Compliance (Compliance Officer)' as user4;