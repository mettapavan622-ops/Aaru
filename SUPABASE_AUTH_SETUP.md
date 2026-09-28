# AARU — Persistent Authentication Setup

The previous AARU authentication stored newly registered users in a Node.js `Map` (`usersDatabase`). That storage is process memory, so a Render restart/redeploy can make a customer account disappear.

This version uses:

- **Supabase Auth** for the permanent email/password credential.
- **Supabase `public.profiles`** for name, phone, role, status, cart, wishlist and login metadata.
- The Node server only keeps a short-lived compatibility cache; it is no longer the source of truth for customer credentials.

## 1. Run the SQL migration

Open your Supabase project → **SQL Editor** and run:

```text
migrations/002_create_profiles.sql
```

The same migration is also copied to:

```text
src/db/migrations/002_create_profiles.sql
```

Do this before testing the new login flow.

## 2. Supabase Auth settings

In Supabase → Authentication → Providers → Email:

- Enable Email provider.
- Decide whether **Confirm email** should be ON or OFF.
- If Confirm email is ON, AARU now shows a confirmation message instead of pretending the user is logged in before verification.

## 3. Render environment variables

Keep the existing frontend variables:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
```

Add these server variables:

```env
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

`SUPABASE_SERVICE_ROLE_KEY` is a **server-only secret**. Never prefix it with `VITE_`, never put it in frontend code, and never commit it to GitHub.

## 4. Why this fixes the 1-hour problem

Before:

```text
Create account
   ↓
Node usersDatabase Map
   ↓
Render restart / process restart
   ↓
User record disappears
```

Now:

```text
Create account
   ↓
Supabase Auth
   ↓
Permanent account
   ↓
1 hour later / next day / Render restart
   ↓
Supabase verifies email + password
   ↓
Login succeeds
```

Supabase's browser client also keeps and refreshes the authentication session. AARU validates that session on the server instead of trusting the old localStorage user object.

## 5. Admin accounts

The admin dashboard still supports the existing root admin fallback for backward compatibility.

New administrator accounts created from **Admin → Customer Access Management** are now created in Supabase Auth and assigned their role in `profiles` + Supabase `app_metadata`.

That means an administrator created from the dashboard remains available after a Render restart.

## 6. Test checklist

After deploying:

1. Create a brand-new customer account.
2. Confirm the account appears in Supabase → Authentication → Users.
3. Confirm a matching row exists in `public.profiles`.
4. Log out.
5. Log in again.
6. Wait an hour or restart/redeploy the Render service.
7. Log in again with the same email/password.
8. Verify the account still works.
9. Add something to cart/wishlist and refresh; with `SUPABASE_SERVICE_ROLE_KEY` configured, those are stored in `profiles` too.
10. Open `/admin/login` and verify the existing administrator still works.

## Important

The old `usersDatabase` still exists in `server.ts` because AARU has other legacy/demo flows that use it. **It is no longer used by the normal customer signup/login flow when Supabase is configured.**
