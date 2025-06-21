import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {children}
    </div>
  );
}
