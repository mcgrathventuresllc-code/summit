/**
 * Create an admin user in Supabase (run once).
 * Usage: node scripts/create-admin.js <email> <password>
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY (Dashboard → Settings → API → service_role)
 * Never commit the service role key.
 */

const fs = require("fs");
const path = require("path");
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8").split(/\n/).forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  });
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "Missing env vars. Add to .env.local:\n" +
    "  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key\n\n" +
    "Get it from Supabase Dashboard → Settings → API → service_role (secret)\n\n" +
    "Run: node scripts/create-admin.js admin@example.com yourpassword"
  );
  process.exit(1);
}

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error("Usage: node scripts/create-admin.js <email> <password>");
  process.exit(1);
}

async function main() {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: "admin" },
  });

  if (error) {
    if (error.message?.includes("already been registered")) {
      console.log("User exists. Updating password...");
      const { data: users } = await supabase.auth.admin.listUsers();
      const user = users?.users?.find((u) => u.email === email);
      if (user) {
        await supabase.auth.admin.updateUserById(user.id, { password });
        console.log("Password updated. Sign in with:", email);
      }
    } else {
      console.error("Error:", error.message);
      process.exit(1);
    }
  } else {
    console.log("Admin created. Sign in with:", email);
  }
}

main();
