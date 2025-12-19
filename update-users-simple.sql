-- Simple step-by-step update for existing users
-- Run each section separately if needed

-- Step 1: Check current users
SELECT id, email FROM auth.users WHERE email IN ('k@gmail.com', 'k1@gmail.com', 'k2@gmail.com', 'k3@gmail.com');

-- Step 2: Update/Insert profiles with full names
-- For k@gmail.com
INSERT INTO profiles (id, full_name, created_at, updated_at)
SELECT id, 'John Admin', NOW(), NOW()
FROM auth.users WHERE email = 'k@gmail.com'
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT id FROM auth.users WHERE email = 'k@gmail.com'));

UPDATE profiles 
SET full_name = 'John Admin', updated_at = NOW()
WHERE id = (SELECT id FROM auth.users WHERE email = 'k@gmail.com');

-- For k1@gmail.com
INSERT INTO profiles (id, full_name, created_at, updated_at)
SELECT id, 'Sarah Johnson', NOW(), NOW()
FROM auth.users WHERE email = 'k1@gmail.com'
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT id FROM auth.users WHERE email = 'k1@gmail.com'));

UPDATE profiles 
SET full_name = 'Sarah Johnson', updated_at = NOW()
WHERE id = (SELECT id FROM auth.users WHERE email = 'k1@gmail.com');

-- For k2@gmail.com
INSERT INTO profiles (id, full_name, created_at, updated_at)
SELECT id, 'Mike Trader', NOW(), NOW()
FROM auth.users WHERE email = 'k2@gmail.com'
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT id FROM auth.users WHERE email = 'k2@gmail.com'));

UPDATE profiles 
SET full_name = 'Mike Trader', updated_at = NOW()
WHERE id = (SELECT id FROM auth.users WHERE email = 'k2@gmail.com');

-- For k3@gmail.com
INSERT INTO profiles (id, full_name, created_at, updated_at)
SELECT id, 'Lisa Compliance', NOW(), NOW()
FROM auth.users WHERE email = 'k3@gmail.com'
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT id FROM auth.users WHERE email = 'k3@gmail.com'));

UPDATE profiles 
SET full_name = 'Lisa Compliance', updated_at = NOW()
WHERE id = (SELECT id FROM auth.users WHERE email = 'k3@gmail.com');

-- Step 3: Assign roles (delete existing first)
DELETE FROM user_roles WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN ('k@gmail.com', 'k1@gmail.com', 'k2@gmail.com', 'k3@gmail.com')
);

-- Insert new roles
INSERT INTO user_roles (user_id, role, created_at)
VALUES 
  ((SELECT id FROM auth.users WHERE email = 'k@gmail.com'), 'admin', NOW()),
  ((SELECT id FROM auth.users WHERE email = 'k1@gmail.com'), 'loan_officer', NOW()),
  ((SELECT id FROM auth.users WHERE email = 'k2@gmail.com'), 'trader', NOW()),
  ((SELECT id FROM auth.users WHERE email = 'k3@gmail.com'), 'compliance_officer', NOW());

-- Step 4: Verify results
SELECT 
  u.email,
  p.full_name,
  ur.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email IN ('k@gmail.com', 'k1@gmail.com', 'k2@gmail.com', 'k3@gmail.com')
ORDER BY u.email;