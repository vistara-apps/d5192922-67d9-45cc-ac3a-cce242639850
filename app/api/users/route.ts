import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabase';
import { NeynarService } from '@/lib/services/neynar';
import { z } from 'zod';

// Validation schemas
const createUserSchema = z.object({
  farcasterFid: z.string(),
  username: z.string().min(1).max(50),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  courses: z.array(z.string()).optional(),
  onchainAddress: z.string(),
  avatarUrl: z.string().url().optional(),
});

const updateUserSchema = z.object({
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  courses: z.array(z.string()).optional(),
  avatarUrl: z.string().url().optional(),
});

// GET /api/users - Get all users or search users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('users')
      .select('*')
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`username.ilike.%${search}%,bio.ilike.%${search}%`);
    }

    const { data: users, error } = await query;

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Error in GET /api/users:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createUserSchema.parse(body);

    // Verify Farcaster user exists
    const farcasterUser = await NeynarService.getUserByFid(
      parseInt(validatedData.farcasterFid)
    );

    if (!farcasterUser) {
      return NextResponse.json(
        { success: false, error: 'Farcaster user not found' },
        { status: 404 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('farcaster_fid', validatedData.farcasterFid)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        farcaster_fid: validatedData.farcasterFid,
        username: validatedData.username,
        bio: validatedData.bio || farcasterUser.bio,
        skills: validatedData.skills || [],
        courses: validatedData.courses || [],
        reputation_score: 0,
        onchain_address: validatedData.onchainAddress,
        avatar_url: validatedData.avatarUrl || farcasterUser.pfp_url,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: newUser,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error in POST /api/users:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
