-- Create an admin user for testing
-- This script creates a sample admin user profile
-- Note: You'll need to sign up with this email first through the normal signup process

-- Update a user to be admin (replace with actual user ID after signup)
-- UPDATE public.profiles 
-- SET is_admin = true 
-- WHERE email = 'admin@modernstore.com';

-- Or create a function to make a user admin by email
CREATE OR REPLACE FUNCTION make_user_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles 
  SET is_admin = true 
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Usage example (uncomment and replace with actual email):
-- SELECT make_user_admin('admin@modernstore.com');
