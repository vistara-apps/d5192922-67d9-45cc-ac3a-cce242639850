'use client';

import { type Resource } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { Download, FileText, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ResourceCardProps {
  resource: Resource;
  onPurchase?: () => void;
  onPreview?: () => void;
  showActions?: boolean;
}

export function ResourceCard({ 
  resource, 
  onPurchase, 
  onPreview, 
  showActions = true 
}: ResourceCardProps) {
  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white flex-shrink-0">
          <FileText className="w-6 h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-textPrimary mb-1 line-clamp-2">
            {resource.title}
          </h3>
          
          <p className="text-sm text-textSecondary mb-2 line-clamp-2">
            {resource.description}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-textSecondary mb-3">
            <span className="px-2 py-1 bg-gray-100 rounded-md">
              {resource.category}
            </span>
            <div className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              <span>{resource.downloadCount} downloads</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-textPrimary">
              {formatPrice(resource.price)}
            </div>
            
            {showActions && (
              <div className="flex gap-2">
                {onPreview && (
                  <Button variant="outline" size="sm" onClick={onPreview}>
                    Preview
                  </Button>
                )}
                {onPurchase && (
                  <Button size="sm" onClick={onPurchase}>
                    Purchase
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
