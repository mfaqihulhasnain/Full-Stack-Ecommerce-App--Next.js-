import React from "react";

export const metadata = {
  title: "My Profile - ShopEase",
  description: "Manage your ShopEase account, view orders, and update your profile.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
} 