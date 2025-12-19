-- Fix CORS issue and add missing policies for notifications
-- Run this in your Supabase SQL Editor

-- Check if notifications table exists and has proper policies
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'notifications' 
  AND schemaname = 'public'
ORDER BY policyname;

-- Add missing policies for notifications table if they don't exist
CREATE POLICY IF NOT EXISTS "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own notifications" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own notifications" ON notifications
  FOR DELETE USING (auth.uid() = user_id);

-- Verify the policies were created
SELECT 
  'Notifications policies created successfully!' as status,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename = 'notifications' 
  AND schemaname = 'public';

-- Note: For CORS issues, you need to:
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to Settings → API
-- 3. Add 'http://localhost:8082' to CORS origins
-- 4. Save the changes