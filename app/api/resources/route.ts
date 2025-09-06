import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabase';
import { PinataService, IPFSHelpers } from '@/lib/services/pinata';
import { z } from 'zod';
import { config } from '@/lib/config';

// Validation schemas
const createResourceSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  uploaderUserId: z.string().uuid(),
  category: z.string().min(1).max(50),
  price: z.number().min(config.business.resources.minPrice).max(config.business.resources.maxPrice),
  file: z.any().optional(), // File will be handled separately
});

const updateResourceSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(1000).optional(),
  category: z.string().min(1).max(50).optional(),
  price: z.number().min(config.business.resources.minPrice).max(config.business.resources.maxPrice).optional(),
});

// GET /api/resources - Get resources with filtering and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const uploaderUserId = searchParams.get('uploaderUserId');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('resources')
      .select(`
        *,
        uploader:users!uploader_user_id(
          id,
          username,
          avatar_url,
          reputation_score
        )
      `)
      .range(offset, offset + limit - 1);

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (uploaderUserId) {
      query = query.eq('uploader_user_id', uploaderUserId);
    }

    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice));
    }

    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice));
    }

    // Apply sorting
    const validSortFields = ['created_at', 'price', 'download_count', 'title'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const ascending = sortOrder === 'asc';

    query = query.order(sortField, { ascending });

    const { data: resources, error } = await query;

    if (error) {
      console.error('Error fetching resources:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch resources' },
        { status: 500 }
      );
    }

    // Add IPFS gateway URLs
    const resourcesWithUrls = resources.map(resource => ({
      ...resource,
      ipfsUrl: IPFSHelpers.getGatewayUrl(resource.ipfs_hash),
    }));

    return NextResponse.json({
      success: true,
      data: resourcesWithUrls,
    });
  } catch (error) {
    console.error('Error in GET /api/resources:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/resources - Create a new resource
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const uploaderUserId = formData.get('uploaderUserId') as string;
    const category = formData.get('category') as string;
    const price = parseFloat(formData.get('price') as string);

    // Validate input data
    const validatedData = createResourceSchema.parse({
      title,
      description,
      uploaderUserId,
      category,
      price,
    });

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'File is required' },
        { status: 400 }
      );
    }

    // Validate file
    if (!FileUploadUtils.isValidResourceFile(file)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type' },
        { status: 400 }
      );
    }

    if (!FileUploadUtils.isValidFileSize(file)) {
      return NextResponse.json(
        { success: false, error: 'File size too large (max 50MB)' },
        { status: 400 }
      );
    }

    // Verify uploader exists
    const { data: uploader } = await supabase
      .from('users')
      .select('id, farcaster_fid')
      .eq('id', validatedData.uploaderUserId)
      .single();

    if (!uploader) {
      return NextResponse.json(
        { success: false, error: 'Uploader not found' },
        { status: 404 }
      );
    }

    // Upload file to IPFS via Pinata
    const metadata = IPFSHelpers.createResourceMetadata(
      validatedData.title,
      validatedData.category,
      validatedData.category, // Using category as subject for now
      uploader.farcaster_fid
    );

    const pinataResponse = await PinataService.pinFile(file, metadata);

    if (!pinataResponse) {
      return NextResponse.json(
        { success: false, error: 'Failed to upload file to IPFS' },
        { status: 500 }
      );
    }

    // Create resource record in database
    const { data: newResource, error } = await supabase
      .from('resources')
      .insert({
        title: validatedData.title,
        description: validatedData.description,
        uploader_user_id: validatedData.uploaderUserId,
        ipfs_hash: pinataResponse.IpfsHash,
        price: validatedData.price,
        category: validatedData.category,
        download_count: 0,
      })
      .select(`
        *,
        uploader:users!uploader_user_id(
          id,
          username,
          avatar_url,
          reputation_score
        )
      `)
      .single();

    if (error) {
      console.error('Error creating resource:', error);
      // Try to unpin the file from IPFS if database insert failed
      await PinataService.unpinFile(pinataResponse.IpfsHash);
      return NextResponse.json(
        { success: false, error: 'Failed to create resource' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...newResource,
        ipfsUrl: IPFSHelpers.getGatewayUrl(newResource.ipfs_hash),
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error in POST /api/resources:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper class for file validation (imported from pinata service)
class FileUploadUtils {
  static isValidResourceFile(file: File): boolean {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
    ];
    return allowedTypes.includes(file.type);
  }

  static isValidFileSize(file: File, maxSizeMB: number = 50): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }
}
