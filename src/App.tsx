import React, { useState } from 'react';
import { ExtensionProvider, useExtensions } from './context/ExtensionContext';
import { Navbar } from './components/Navbar';
import { ExtensionsManager } from './components/ExtensionsManager';
import { WebStore } from './components/WebStore';
import { BrowserProxyHub } from './components/BrowserProxyHub';
import { ExtensionDetailsModal } from './components/ExtensionDetailsModal';
import { CustomExtensionModal } from './components/CustomExtensionModal';
import { ScreenityOverlay } from './components/ScreenityOverlay';
import { PanicCloakOverlay } from './components/PanicCloakOverlay';

const MainAppContent: React.FC = () => {
  const { activeTab } = useExtensions();
  const [customModalOpen, setCustomModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans text-gray-900 antialiased selection:bg-blue-500 selection:text-white">
      {/* Top ChromeOS Navigation Bar */}
      <Navbar />

      {/* Main Tab Content */}
      <main className="flex-1">
        {activeTab === 'extensions' && (
          <ExtensionsManager onOpenCustomModal={() => setCustomModalOpen(true)} />
        )}
        {activeTab === 'store' && <WebStore />}
        {activeTab === 'hub' && <BrowserProxyHub />}
      </main>

      {/* Floating Global Overlays & Modals */}
      <ExtensionDetailsModal />
      <CustomExtensionModal
        isOpen={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
      />
      <ScreenityOverlay />
      <PanicCloakOverlay />
    </div>
  );
};

export default function App() {
  return (
    <ExtensionProvider>
      <MainAppContent />
    </ExtensionProvider>
  );
}
