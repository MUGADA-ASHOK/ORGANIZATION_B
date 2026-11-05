import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ConsumerPanel from './components/ConsumerPanel';
import ProviderPanel from './components/ProviderPanel';

export default function App() {
  const [activeMode, setActiveMode] = useState('consumer');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar activeMode={activeMode} setActiveMode={setActiveMode} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeMode === 'consumer' ? <ConsumerPanel /> : <ProviderPanel />}
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        College B DEPA Gateway — Local Port: 8082 | Frontend Port: 5175
      </footer>
    </div>
  );
}
