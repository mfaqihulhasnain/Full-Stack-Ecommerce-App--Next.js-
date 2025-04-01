'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  withBlur?: boolean;
  aspectRatio?: number;
  fallbackSrc?: string;
  priority?: boolean;
}

/**
 * OptimizedImage - A simpler version to ensure images load properly
 */
export function OptimizedImage({
  src,
  alt,
  className,
  withBlur = true,
  aspectRatio,
  priority = false,
  fallbackSrc = 'https://placehold.co/600x400/eee/999?text=Image+not+found',
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const aspectRatioStyles = aspectRatio
    ? { aspectRatio: String(aspectRatio), width: '100%' }
    : {};
  
  return (
    <div 
      className={cn(
        'relative overflow-hidden bg-gray-100',
        className
      )}
      style={aspectRatioStyles}
    >
      <Image
        src={hasError ? fallbackSrc : src}
        alt={alt}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          console.error(`Failed to load image: ${src}`);
          setHasError(true);
          setIsLoading(false);
        }}
        className={cn(
          'object-cover'
        )}
        sizes={props.sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
        priority={priority}
        {...props}
      />
    </div>
  );
} 