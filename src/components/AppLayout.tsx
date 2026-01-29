import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import './AppLayout.css';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-layout-content">
        {children}
      </div>
    </div>
  );
}
