import React from 'react';

export default function UpdateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="update-layout">
      {children}
    </div>
  );
}
