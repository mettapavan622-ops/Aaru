import bcrypt from 'bcryptjs';

/**
 * Seeding Script for Atelier Initial Admin Account
 * Exact required credentials:
 * Email: aarubymoni@admin.co.in
 * Password: aarubymoni@1
 * Role: ADMIN
 */
export async function generateAdminSeed() {
  const email = 'aarubymoni@admin.co.in';
  const plaintextPassword = 'aarubymoni@1';
  const role = 'ADMIN';
  const name = 'Atelier Director Moni';
  const phone = '+91 93460 66170';

  const passwordHash = bcrypt.hashSync(plaintextPassword, 10);

  const seedPayload = {
    id: 'usr-admin-moni',
    email,
    passwordHash,
    role,
    status: 'ACTIVE' as const,
    name,
    phone,
    createdAt: new Date().toISOString()
  };

  const sqlCommand = `
INSERT INTO users (id, email, password_hash, role, status, name, phone, created_at, updated_at)
VALUES (
  '${seedPayload.id}',
  '${email}',
  '${passwordHash}',
  '${role}',
  'ACTIVE',
  '${name}',
  '${phone}',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = '${passwordHash}',
  role = 'ADMIN',
  status = 'ACTIVE',
  updated_at = NOW();
  `.trim();

  return { seedPayload, sqlCommand, passwordHash };
}

if (process.argv[1]?.endsWith('seedAdmin.ts')) {
  generateAdminSeed().then(({ email, passwordHash, sqlCommand }: any) => {
    console.log('--- Admin Account Seeded Successfully ---');
    console.log(`Email: ${email}`);
    console.log(`Password Hash: ${passwordHash}`);
    console.log('\nPostgreSQL SQL Statement:');
    console.log(sqlCommand);
  });
}
