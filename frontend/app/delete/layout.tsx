import React from 'react';

export default function DeleteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="delete-layout">
      {children}
    </div>
  );
}
