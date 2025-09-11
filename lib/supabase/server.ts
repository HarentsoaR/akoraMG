import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Validate configuration
if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Supabase server not configured properly!")
  console.error("Please set up your .env.local file with:")
  console.error("NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url")
  console.error("SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key")
}

export const createClient = () => {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
