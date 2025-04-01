import { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { SearchProvider } from "@/providers/search-provider";
import { LoadingProvider } from "@/components/ui/loading-provider";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <LoadingProvider>
      <SearchProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </SearchProvider>
    </LoadingProvider>
  );
} 