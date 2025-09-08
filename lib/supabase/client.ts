import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Validate configuration
if (!supabaseUrl || !supabaseKey || 
    supabaseUrl === "your_supabase_project_url_here" || 
    supabaseKey === "your_supabase_anon_key_here") {
  console.error("❌ Supabase not configured properly!")
  console.error("Please set up your .env.local file with:")
  console.error("NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url")
  console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key")
}

export const supabase = createClient(supabaseUrl, supabaseKey)


