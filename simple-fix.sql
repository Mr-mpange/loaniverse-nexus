-- Simple fix - just create table and assign role
-- Run this step by step

-- Step 1: Create the enum type
CREATE TYPE app_role AS ENUM ('admin', 'loan_officer', 'trader', 'compliance_officer');

-- Step 2: Create the user_roles table
CREATE TABLE user_roles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 3: Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policies
CREATE POLICY "Users can view own role" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own role" ON user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Step 5: Assign admin role to your user
INSERT INTO user_roles (user_id, role)
VALUES ('898e7228-68ae-4d3f-957d-4c9268311e5c', 'admin');

-- Step 6: Verify
SELECT 
  u.email,
  ur.role
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
WHERE u.id = '898e7228-68ae-4d3f-957d-4c9268311e5c';