'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface RawImageProps {
  src: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  style?: React.CSSProperties;
}

export function RawImage({ 
  src, 
  alt = "Image", 
  className, 
  width,
  height,
  fill = false,
  style,
  ...props 
}: RawImageProps) {
  
  const fillStyles: React.CSSProperties = fill ? {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  } : {};
  
  const combinedStyles = {
    ...fillStyles,
    ...style,
  };
  
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img 
      src={src} 
      alt={alt} 
      className={cn('', className)}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      style={combinedStyles}
      onError={(e) => {
        e.currentTarget.src = 'https://placehold.co/600x400/eee/999?text=Image+not+found';
      }}
      {...props}
    />
  );
} 