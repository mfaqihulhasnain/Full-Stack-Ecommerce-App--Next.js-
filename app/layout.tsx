import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MainLayout } from "@/components/layout/main-layout";
import { ClerkProvider } from "@clerk/nextjs";
import { UserProvider } from "@/app/context/UserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NovaBuy - Your Online Shopping Destination",
  description: "Find the best products at great prices. Fast shipping and excellent customer service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          footer: "hidden",
          footerAction: "hidden",
          powerButton: "hidden",
          rootBox: {
            boxShadow: "none"
          },
          card: {
            boxShadow: "none",
            border: "1px solid #e5e7eb"
          },
          logoBox: "hidden",
          logoImage: "hidden",
          badge: "hidden",
          socialButtonsBlockButton: {
            borderColor: "#e5e7eb"
          }
        },
        variables: {
          colorPrimary: "#3b82f6",
          borderRadius: "0.5rem"
        },
        layout: {
          socialButtonsPlacement: "bottom",
          socialButtonsVariant: "iconButton"
        }
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <UserProvider>
            <MainLayout>{children}</MainLayout>
          </UserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
