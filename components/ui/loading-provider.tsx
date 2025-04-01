'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { LoadingScreen } from './loading';

type LoadingContextType = {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
};

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Set loading to true on first load with longer duration
  useEffect(() => {
    if (isFirstLoad) {
      // Ensure we have a maximum loading time of 3 seconds
      const timer = setTimeout(() => {
        setIsLoading(false);
        setIsFirstLoad(false);
      }, 2000);

      // Fallback safety timeout in case of any issues
      const safetyTimeout = setTimeout(() => {
        setIsLoading(false);
        setIsFirstLoad(false);
      }, 5000);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(safetyTimeout);
      };
    }
  }, [isFirstLoad]);

  // Show loading screen when route changes (but not on first load)
  useEffect(() => {
    if (!isFirstLoad) {
      setIsLoading(true);
      
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      
      // Safety timeout
      const safetyTimeout = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      
      return () => {
        clearTimeout(timeout);
        clearTimeout(safetyTimeout);
      };
    }
  }, [pathname, searchParams, isFirstLoad]);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {isLoading && <LoadingScreen />}
      <div 
        className={isLoading ? 'invisible' : 'visible'}
        style={{ 
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-out' 
        }}
      >
        {children}
      </div>
    </LoadingContext.Provider>
  );
} 