import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabase';
import { z } from 'zod';
import { config } from '@/lib/config';

// Validation schemas
const createSessionSchema = z.object({
  tutorId: z.string().uuid(),
  studentId: z.string().uuid(),
  subject: z.string().min(1).max(100),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  price: z.number().min(config.business.tutoring.minPrice).max(config.business.tutoring.maxPrice),
});

const updateSessionSchema = z.object({
  status: z.enum(['pending', 'active', 'completed', 'cancelled']).optional(),
  paymentTxHash: z.string().optional(),
});

// GET /api/tutoring/sessions - Get tutoring sessions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('tutoring_sessions')
      .select(`
        *,
        tutor:users!tutor_id(
          id,
          username,
          avatar_url,
          reputation_score
        ),
        student:users!student_id(
          id,
          username,
          avatar_url,
          reputation_score
        )
      `)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.or(`tutor_id.eq.${userId},student_id.eq.${userId}`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: sessions, error } = await query;

    if (error) {
      console.error('Error fetching sessions:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch sessions' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error('Error in GET /api/tutoring/sessions:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/tutoring/sessions - Create a new tutoring session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createSessionSchema.parse(body);

    // Validate session duration
    const startTime = new Date(validatedData.startTime);
    const endTime = new Date(validatedData.endTime);
    const duration = endTime.getTime() - startTime.getTime();

    if (duration < config.business.minSessionDuration) {
      return NextResponse.json(
        { success: false, error: 'Session duration too short (minimum 30 minutes)' },
        { status: 400 }
      );
    }

    if (duration > config.business.maxSessionDuration) {
      return NextResponse.json(
        { success: false, error: 'Session duration too long (maximum 4 hours)' },
        { status: 400 }
      );
    }

    // Validate that tutor and student exist
    const { data: tutor } = await supabase
      .from('users')
      .select('id')
      .eq('id', validatedData.tutorId)
      .single();

    const { data: student } = await supabase
      .from('users')
      .select('id')
      .eq('id', validatedData.studentId)
      .single();

    if (!tutor || !student) {
      return NextResponse.json(
        { success: false, error: 'Tutor or student not found' },
        { status: 404 }
      );
    }

    if (validatedData.tutorId === validatedData.studentId) {
      return NextResponse.json(
        { success: false, error: 'Tutor and student cannot be the same person' },
        { status: 400 }
      );
    }

    // Check for scheduling conflicts
    const { data: conflicts } = await supabase
      .from('tutoring_sessions')
      .select('id')
      .or(`tutor_id.eq.${validatedData.tutorId},student_id.eq.${validatedData.studentId}`)
      .in('status', ['pending', 'active'])
      .or(`start_time.lte.${validatedData.endTime},end_time.gte.${validatedData.startTime}`);

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Scheduling conflict detected' },
        { status: 409 }
      );
    }

    // Create new session
    const { data: newSession, error } = await supabase
      .from('tutoring_sessions')
      .insert({
        tutor_id: validatedData.tutorId,
        student_id: validatedData.studentId,
        subject: validatedData.subject,
        start_time: validatedData.startTime,
        end_time: validatedData.endTime,
        price: validatedData.price,
        status: 'pending',
      })
      .select(`
        *,
        tutor:users!tutor_id(
          id,
          username,
          avatar_url,
          reputation_score
        ),
        student:users!student_id(
          id,
          username,
          avatar_url,
          reputation_score
        )
      `)
      .single();

    if (error) {
      console.error('Error creating session:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create session' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: newSession,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error in POST /api/tutoring/sessions:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
