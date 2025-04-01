'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Command } from 'lucide-react';
import { SearchForm } from './search-form';

export function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center text-sm px-3 py-1.5 rounded-full border border-input text-muted-foreground hover:bg-secondary transition-colors"
      >
        <Command size={16} className="mr-1.5" />
        Search...
        <kbd className="ml-auto bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs">⌘K</kbd>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Search Products</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <SearchForm 
              size="lg" 
              autoFocus 
              showSuggestions
              onSearch={handleSearch}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 