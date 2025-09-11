import { supabase } from "@/lib/supabase/client"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log('🔍 Debug: Fetching all users...')
    
    // Get all users
    const { data: allUsers, error: usersError } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .limit(10)

    console.log('👥 All users:', allUsers)
    if (usersError) {
      console.error('❌ Users error:', usersError)
    }

    // Get all artisan profiles
    const { data: artisanProfiles, error: profilesError } = await supabase
      .from('artisan_profiles')
      .select('*')
      .limit(10)

    console.log('🎨 Artisan profiles:', artisanProfiles)
    if (profilesError) {
      console.error('❌ Profiles error:', profilesError)
    }

    // Try to join them
    const { data: joinedData, error: joinError } = await supabase
      .from('users')
      .select(`
        id,
        name,
        email,
        role,
        artisan_profiles (*)
      `)
      .not('artisan_profiles', 'is', null)

    console.log('🔗 Joined data:', joinedData)
    if (joinError) {
      console.error('❌ Join error:', joinError)
    }

    return NextResponse.json({
      allUsers,
      artisanProfiles,
      joinedData,
      usersError: usersError?.message,
      profilesError: profilesError?.message,
      joinError: joinError?.message
    })
  } catch (error) {
    console.error('❌ Debug error:', error)
    return NextResponse.json(
      { error: 'Debug failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
