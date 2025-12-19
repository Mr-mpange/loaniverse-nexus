-- Utility script to assign roles to users
-- Use this to assign roles to new users after they sign up

-- 1. First, check what users exist and their current roles
SELECT 
  u.id,
  u.email,
  u.created_at,
  ur.role
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at DESC;

-- 2. Assign a role to a specific user (replace USER_ID and ROLE)
-- INSERT INTO user_roles (user_id, role)
-- VALUES ('USER_ID_HERE', 'ROLE_HERE');

-- Example role assignments:
-- INSERT INTO user_roles (user_id, role) VALUES ('user-id-1', 'admin');
-- INSERT INTO user_roles (user_id, role) VALUES ('user-id-2', 'loan_officer');
-- INSERT INTO user_roles (user_id, role) VALUES ('user-id-3', 'trader');
-- INSERT INTO user_roles (user_id, role) VALUES ('user-id-4', 'compliance_officer');

-- 3. Verify the assignment
SELECT 
  u.email,
  ur.role,
  ur.created_at as role_assigned_at
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
ORDER BY ur.created_at DESC;