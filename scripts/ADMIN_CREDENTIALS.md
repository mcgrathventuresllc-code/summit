# Admin Account

Create an admin user for local development. Use your own email and a strong password.

## Create via Supabase Dashboard (easiest)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. **Authentication** → **Users** → **Add user** → **Create new user**
3. Enter your admin email and password
5. Check "Auto Confirm User" so you can sign in immediately
6. Click **Create user**
7. Sign in on the Crew page with these credentials

## Or create via script (requires service role key)

1. Add to `.env.local`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
   Get it from Dashboard → Settings → API → **service_role** (secret)

2. Run:
   ```bash
   npm run create-admin
   ```
