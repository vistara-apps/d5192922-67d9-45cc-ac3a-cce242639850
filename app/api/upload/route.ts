// API route for file uploads to IPFS
import { NextRequest, NextResponse } from 'next/server';
import { pinataAPI } from '@/lib/api/pinata';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not supported' },
        { status: 400 }
      );
    }

    // Upload to IPFS via Pinata
    const result = await pinataAPI.uploadFile(file, {
      name: file.name,
      keyvalues: {
        uploadedAt: new Date().toISOString(),
        fileType: file.type,
        fileSize: file.size.toString(),
        uploader: 'peerlink-app'
      }
    });

    return NextResponse.json({
      success: true,
      ipfsHash: result.hash,
      fileName: file.name,
      fileSize: file.size,
      gatewayUrl: pinataAPI.getGatewayUrl(result.hash)
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hash = searchParams.get('hash');

    if (!hash) {
      return NextResponse.json(
        { error: 'IPFS hash required' },
        { status: 400 }
      );
    }

    // Get file metadata from Pinata
    const metadata = await pinataAPI.getFileMetadata(hash);
    
    return NextResponse.json({
      success: true,
      metadata,
      gatewayUrl: pinataAPI.getGatewayUrl(hash)
    });

  } catch (error) {
    console.error('Metadata fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch file metadata' },
      { status: 500 }
    );
  }
}
