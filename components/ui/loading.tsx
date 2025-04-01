'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Loader2 } from "lucide-react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function Loading({ size = "md", text, className = "" }: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      {text && (
        <p className="mt-2 text-sm text-gray-500">{text}</p>
      )}
    </div>
  );
}

export function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 200);
    
    // Force progress to complete after 3 seconds maximum
    const forceComplete = setTimeout(() => {
      setProgress(100);
    }, 3000);
    
    // Safety timeout - force hide after 5 seconds maximum
    const safetyTimeout = setTimeout(() => {
      setLoading(false);
    }, 5000);
    
    // Clean up timers
    return () => {
      clearInterval(interval);
      clearTimeout(forceComplete);
      clearTimeout(safetyTimeout);
    };
  }, []);
  
  // Automatically hide when progress is 100%
  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [progress]);
  
  if (!loading) return null;
  
  // Round the progress to the nearest integer for display
  const displayProgress = Math.round(progress);
  
  return (
    <div 
      className="fixed inset-0 bg-background flex items-center justify-center z-50 flex-col animate-fadeIn"
      style={{ 
        opacity: progress === 100 ? 0 : 1,
        transition: 'opacity 0.5s ease-in-out'
      }}
    >
      <div className="relative flex items-center justify-center mb-8 animate-logoFloat">
        <div className="absolute inset-0 bg-primary/5 rounded-full transform scale-150 animate-pulse" />
        <Image 
          src="/images/logo.svg" 
          alt="NovaBuy" 
          width={220} 
          height={60}
          className="z-10 animate-logoRotate"
          priority
        />
      </div>
      
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="text-primary font-medium text-lg mb-4">
        {displayProgress}%
      </div>
      
      <p className="text-muted-foreground text-sm animate-pulse">
        {progress < 100 ? 'Loading your experience...' : 'Ready!'}
      </p>
    </div>
  );
} 