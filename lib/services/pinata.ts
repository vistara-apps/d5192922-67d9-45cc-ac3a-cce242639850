import axios from 'axios';
import { config } from '../config';

// Pinata API client for IPFS storage
const pinataClient = axios.create({
  baseURL: config.api.pinata.baseUrl,
  headers: {
    'Authorization': `Bearer ${config.api.pinata.jwt}`,
    'Content-Type': 'application/json',
  },
});

// Types for Pinata API
export interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate?: boolean;
}

export interface PinataMetadata {
  name?: string;
  keyvalues?: Record<string, string | number>;
}

export interface PinataOptions {
  cidVersion?: 0 | 1;
  wrapWithDirectory?: boolean;
  customPinPolicy?: {
    regions: Array<{
      id: string;
      desiredReplicationCount: number;
    }>;
  };
}

export interface PinnedFile {
  id: string;
  ipfs_pin_hash: string;
  size: number;
  user_id: string;
  date_pinned: string;
  date_unpinned?: string;
  metadata: {
    name?: string;
    keyvalues?: Record<string, any>;
  };
  regions: Array<{
    regionId: string;
    currentReplicationCount: number;
    desiredReplicationCount: number;
  }>;
  mime_type: string;
  number_of_files: number;
}

// Pinata service for IPFS operations
export class PinataService {
  // Pin JSON data to IPFS
  static async pinJSON(
    data: any,
    metadata?: PinataMetadata,
    options?: PinataOptions
  ): Promise<PinataResponse | null> {
    try {
      const body = {
        pinataContent: data,
        pinataMetadata: metadata,
        pinataOptions: options,
      };

      const response = await pinataClient.post('/pinning/pinJSONToIPFS', body);
      return response.data;
    } catch (error) {
      console.error('Error pinning JSON to IPFS:', error);
      return null;
    }
  }

  // Pin file to IPFS
  static async pinFile(
    file: File,
    metadata?: PinataMetadata,
    options?: PinataOptions
  ): Promise<PinataResponse | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      if (metadata) {
        formData.append('pinataMetadata', JSON.stringify(metadata));
      }

      if (options) {
        formData.append('pinataOptions', JSON.stringify(options));
      }

      const response = await pinataClient.post('/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error pinning file to IPFS:', error);
      return null;
    }
  }

  // Pin file from URL
  static async pinByHash(
    hashToPin: string,
    metadata?: PinataMetadata
  ): Promise<PinataResponse | null> {
    try {
      const body = {
        hashToPin,
        pinataMetadata: metadata,
      };

      const response = await pinataClient.post('/pinning/pinByHash', body);
      return response.data;
    } catch (error) {
      console.error('Error pinning by hash:', error);
      return null;
    }
  }

  // Get list of pinned files
  static async getPinnedFiles(
    status: 'pinned' | 'unpinned' = 'pinned',
    limit: number = 10,
    offset: number = 0
  ): Promise<{ rows: PinnedFile[]; count: number } | null> {
    try {
      const response = await pinataClient.get('/data/pinList', {
        params: {
          status,
          pageLimit: limit,
          pageOffset: offset,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error getting pinned files:', error);
      return null;
    }
  }

  // Unpin file from IPFS
  static async unpinFile(hashToUnpin: string): Promise<boolean> {
    try {
      await pinataClient.delete(`/pinning/unpin/${hashToUnpin}`);
      return true;
    } catch (error) {
      console.error('Error unpinning file:', error);
      return false;
    }
  }

  // Get file metadata
  static async getFileMetadata(hash: string): Promise<PinnedFile | null> {
    try {
      const response = await pinataClient.get('/data/pinList', {
        params: {
          hashContains: hash,
          status: 'pinned',
          pageLimit: 1,
        },
      });

      const files = response.data.rows;
      return files.length > 0 ? files[0] : null;
    } catch (error) {
      console.error('Error getting file metadata:', error);
      return null;
    }
  }

  // Update file metadata
  static async updateMetadata(
    hash: string,
    metadata: PinataMetadata
  ): Promise<boolean> {
    try {
      await pinataClient.put(`/pinning/hashMetadata`, {
        ipfsPinHash: hash,
        name: metadata.name,
        keyvalues: metadata.keyvalues,
      });
      return true;
    } catch (error) {
      console.error('Error updating metadata:', error);
      return false;
    }
  }

  // Test authentication
  static async testAuthentication(): Promise<boolean> {
    try {
      await pinataClient.get('/data/testAuthentication');
      return true;
    } catch (error) {
      console.error('Pinata authentication failed:', error);
      return false;
    }
  }
}

// Helper functions for IPFS operations
export class IPFSHelpers {
  // Generate IPFS gateway URL
  static getGatewayUrl(hash: string, gateway: string = 'https://gateway.pinata.cloud'): string {
    return `${gateway}/ipfs/${hash}`;
  }

  // Validate IPFS hash format
  static isValidIPFSHash(hash: string): boolean {
    // Basic validation for IPFS hash (CIDv0 and CIDv1)
    const cidv0Regex = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
    const cidv1Regex = /^b[a-z2-7]{58}$/;
    
    return cidv0Regex.test(hash) || cidv1Regex.test(hash);
  }

  // Extract hash from IPFS URL
  static extractHashFromUrl(url: string): string | null {
    const match = url.match(/\/ipfs\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  }

  // Create metadata for academic resources
  static createResourceMetadata(
    title: string,
    category: string,
    subject: string,
    uploaderFid: string
  ): PinataMetadata {
    return {
      name: title,
      keyvalues: {
        category,
        subject,
        uploaderFid,
        uploadedAt: Date.now(),
        type: 'academic-resource',
      },
    };
  }

  // Create metadata for session recordings
  static createSessionMetadata(
    sessionId: string,
    subject: string,
    tutorFid: string,
    studentFid: string
  ): PinataMetadata {
    return {
      name: `Session Recording - ${subject}`,
      keyvalues: {
        sessionId,
        subject,
        tutorFid,
        studentFid,
        recordedAt: Date.now(),
        type: 'session-recording',
      },
    };
  }
}

// File upload utilities
export class FileUploadUtils {
  // Validate file type for academic resources
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

  // Validate file size (max 50MB for resources)
  static isValidFileSize(file: File, maxSizeMB: number = 50): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  // Generate unique filename
  static generateUniqueFilename(originalName: string, userFid: string): string {
    const timestamp = Date.now();
    const extension = originalName.split('.').pop();
    const baseName = originalName.replace(/\.[^/.]+$/, '');
    
    return `${userFid}_${timestamp}_${baseName}.${extension}`;
  }

  // Compress image if needed
  static async compressImage(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }
}
