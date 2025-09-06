import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabase';
import { z } from 'zod';

// Validation schema for user updates
const updateUserSchema = z.object({
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  courses: z.array(z.string()).optional(),
  avatarUrl: z.string().url().optional(),
});

// GET /api/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { data: user, error } = await supabase
      .from('users')
      .select(`
        *,
        tutoring_sessions_as_tutor:tutoring_sessions!tutor_id(
          id,
          subject,
          status,
          price,
          created_at
        ),
        tutoring_sessions_as_student:tutoring_sessions!student_id(
          id,
          subject,
          status,
          price,
          created_at
        ),
        skills_offered:skills!offered_by_user_id(
          id,
          skill_name,
          description,
          price_or_exchange,
          category
        ),
        resources_uploaded:resources!uploader_user_id(
          id,
          title,
          description,
          price,
          category,
          download_count
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching user:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch user' },
        { status: 500 }
      );
    }

    // Calculate user statistics
    const stats = {
      totalSessions: user.tutoring_sessions_as_tutor.length + user.tutoring_sessions_as_student.length,
      completedSessions: [
        ...user.tutoring_sessions_as_tutor,
        ...user.tutoring_sessions_as_student
      ].filter(session => session.status === 'completed').length,
      skillsOffered: user.skills_offered.length,
      resourcesUploaded: user.resources_uploaded.length,
      totalDownloads: user.resources_uploaded.reduce((sum: number, resource: any) => sum + resource.download_count, 0),
      totalEarnings: [
        ...user.tutoring_sessions_as_tutor.filter((session: any) => session.status === 'completed'),
        ...user.resources_uploaded
      ].reduce((sum: number, item: any) => sum + (item.price || 0), 0),
    };

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        stats,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/users/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user profile
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (validatedData.bio !== undefined) updateData.bio = validatedData.bio;
    if (validatedData.skills !== undefined) updateData.skills = validatedData.skills;
    if (validatedData.courses !== undefined) updateData.courses = validatedData.courses;
    if (validatedData.avatarUrl !== undefined) updateData.avatar_url = validatedData.avatarUrl;

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error in PUT /api/users/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user account
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete user (this will cascade to related records)
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /api/users/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
