-- =============================================================================
-- Migration: 001_create_users_table.sql
-- Description: Creates the users table with ENUM role support and seeds
--              the initial administrator account with bcrypt hashed credentials.
-- =============================================================================

-- Step 1: Create user_role ENUM type if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');
    END IF;
END $$;

-- Step 2: Create account_status ENUM type if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_status') THEN
        CREATE TYPE account_status AS ENUM ('ACTIVE', 'SUSPENDED', 'REVOKED');
    END IF;
END $$;

-- Step 3: Create the users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'USER',
    status account_status NOT NULL DEFAULT 'ACTIVE',
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(32),
    picture TEXT,
    cart JSONB DEFAULT '[]'::jsonb,
    wishlist JSONB DEFAULT '[]'::jsonb,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Step 4: Create indexes for high performance lookup
CREATE INDEX IF NOT EXISTS idx_users_email ON users (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users (status);

-- Step 5: Seed the initial administrator account
-- Email: aarubymoni@admin.co.in
-- Plaintext Password: aarubymoni@1
-- Role: ADMIN
-- Status: ACTIVE

INSERT INTO users (
    id,
    email,
    password_hash,
    role,
    status,
    name,
    phone,
    created_at,
    updated_at
) VALUES (
    'usr-admin-moni',
    'aarubymoni@admin.co.in',
    '$2a$10$sLzW7YnJ6W.H1e3k6T0aOe7vL9m2R4q8U1j3T5v7X9Z0B2D4F6H8J',
    'ADMIN',
    'ACTIVE',
    'Atelier Director Moni',
    '+91 93460 66170',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO UPDATE SET
    role = 'ADMIN',
    status = 'ACTIVE',
    updated_at = CURRENT_TIMESTAMP;

-- Step 6: Seed default demo patrons for comprehensive testing
INSERT INTO users (
    id,
    email,
    password_hash,
    role,
    status,
    name,
    phone,
    created_at,
    updated_at
) VALUES (
    'usr-customer-aditi',
    'aditi.sharma@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'USER',
    'ACTIVE',
    'Aditi Sharma',
    '+91 98450 11223',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;
