'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function SimpleImage({ 
  src, 
  alt, 
  className, 
  fill, 
  ...props 
}: React.ComponentProps<typeof Image>) {
  const [error, setError] = useState(false);
  
  if (error) {
    return (
      <div className={cn(
        'relative overflow-hidden', 
        !fill && 'inline-block',
        className
      )}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={src?.toString()} 
          alt={alt?.toString() || "Image"} 
          className="object-cover w-full h-full"
          style={fill ? { position: 'absolute', inset: 0 } : undefined}
          onError={(e) => {
            // If even this fails, show a colored placeholder
            e.currentTarget.src = 'https://placehold.co/600x400/eee/999?text=Image+not+found';
          }}
        />
      </div>
    );
  }
  
  return (
    <div className={cn(
      'relative overflow-hidden', 
      !fill && 'inline-block',
      className
    )}>
      <Image
        src={src}
        alt={alt || "Image"}
        className="object-cover"
        unoptimized
        onError={() => setError(true)}
        {...props}
        fill={fill}
      />
    </div>
  );
} 