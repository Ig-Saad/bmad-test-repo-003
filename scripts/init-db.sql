-- Initialize BMad v6-Powered SDLC Platform Database
-- This script sets up the initial database structure and configuration

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create application user and set permissions
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'bmad_user') THEN
      CREATE USER bmad_user WITH PASSWORD 'bmad_dev_password';
   END IF;
END
$$;

-- Grant permissions to bmad_user
GRANT ALL PRIVILEGES ON DATABASE bmad_platform TO bmad_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO bmad_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bmad_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO bmad_user;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO bmad_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO bmad_user;

-- Create indexes for better performance (these will be created by Prisma, but good to have)
-- Note: Prisma will handle the actual table creation, this is just for initial setup

-- Log the initialization
SELECT 'BMad Platform Database Initialized Successfully' as status;