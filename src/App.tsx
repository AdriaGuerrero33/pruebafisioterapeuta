import { useState } from 'react';
import { Sidebar, MobileSidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <Sidebar />
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Dashboard onOpenSidebar={() => setSidebarOpen(true)} />
      </div>
    </div>
  );
}
