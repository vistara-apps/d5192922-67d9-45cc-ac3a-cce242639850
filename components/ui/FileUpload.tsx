// File upload component with IPFS integration
'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { pinataAPI } from '@/lib/api/pinata';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onUpload: (ipfsHash: string, fileName: string) => void;
  onError?: (error: string) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  multiple?: boolean;
  className?: string;
}

interface UploadedFile {
  file: File;
  status: 'uploading' | 'success' | 'error';
  ipfsHash?: string;
  error?: string;
}

export function FileUpload({
  onUpload,
  onError,
  accept = {
    'application/pdf': ['.pdf'],
    'text/plain': ['.txt'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'image/*': ['.png', '.jpg', '.jpeg', '.gif']
  },
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false,
  className
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const uploadToIPFS = async (file: File) => {
    try {
      const result = await pinataAPI.uploadFile(file, {
        name: file.name,
        keyvalues: {
          uploadedAt: new Date().toISOString(),
          fileType: file.type,
          fileSize: file.size.toString()
        }
      });

      return result.hash;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw new Error('Failed to upload file to IPFS');
    }
  };

  const handleFileUpload = async (files: File[]) => {
    const newFiles: UploadedFile[] = files.map(file => ({
      file,
      status: 'uploading'
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileIndex = uploadedFiles.length + i;

      try {
        const ipfsHash = await uploadToIPFS(file);
        
        setUploadedFiles(prev => prev.map((uploadedFile, index) => 
          index === fileIndex 
            ? { ...uploadedFile, status: 'success', ipfsHash }
            : uploadedFile
        ));

        onUpload(ipfsHash, file.name);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        
        setUploadedFiles(prev => prev.map((uploadedFile, index) => 
          index === fileIndex 
            ? { ...uploadedFile, status: 'error', error: errorMessage }
            : uploadedFile
        ));

        onError?.(errorMessage);
      }
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleFileUpload(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-primary hover:bg-gray-50'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        
        {isDragActive ? (
          <p className="text-primary font-medium">Drop files here...</p>
        ) : (
          <div>
            <p className="text-textPrimary font-medium mb-2">
              Drag & drop files here, or click to select
            </p>
            <p className="text-textSecondary text-sm">
              Max file size: {formatFileSize(maxSize)}
            </p>
          </div>
        )}
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-textPrimary">
            {multiple ? 'Uploaded Files' : 'Uploaded File'}
          </h4>
          
          {uploadedFiles.map((uploadedFile, index) => {
            const { file, status, ipfsHash, error } = uploadedFile;
            const fileIcon = getFileIcon(file);

            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-surface rounded-lg border"
              >
                {/* File Icon/Preview */}
                <div className="flex-shrink-0">
                  {fileIcon ? (
                    <img
                      src={fileIcon}
                      alt={file.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <File className="w-10 h-10 text-gray-400" />
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-textPrimary truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-textSecondary">
                    {formatFileSize(file.size)}
                  </p>
                  
                  {status === 'success' && ipfsHash && (
                    <p className="text-xs text-green-600 mt-1">
                      Uploaded to IPFS: {ipfsHash.substring(0, 12)}...
                    </p>
                  )}
                  
                  {status === 'error' && error && (
                    <p className="text-xs text-red-600 mt-1">
                      {error}
                    </p>
                  )}
                </div>

                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {status === 'uploading' && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  )}
                  
                  {status === 'success' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  
                  {status === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFile(index)}
                  className="flex-shrink-0 p-1 hover:bg-gray-100 rounded"
                  disabled={status === 'uploading'}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
