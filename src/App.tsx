import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ItineraryView } from './components/ItineraryView';
import { TransitView } from './components/TransitView';
import { PlanView } from './components/PlanView';
import { SavedView } from './components/SavedView';
import { BottomNav } from './components/BottomNav';
import { ImageLightboxModal } from './components/ImageLightboxModal';
import { ActiveTab, ImageModalData, ItineraryData } from './types';
import { INITIAL_ITINERARY } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [modalData, setModalData] = useState<ImageModalData | null>(null);
  const [itineraryData, setItineraryData] = useState<ItineraryData>(INITIAL_ITINERARY);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Background real-time traffic & price synchronization indicator
  useEffect(() => {
    const syncInterval = setInterval(() => {
      setIsSyncing(true);
      setTimeout(() => setIsSyncing(false), 2000);
    }, 20000);

    return () => clearInterval(syncInterval);
  }, []);

  const handleOpenImageModal = (data: ImageModalData) => {
    setModalData(data);
  };

  const handleCloseImageModal = () => {
    setModalData(null);
  };

  const handleGeneratedItinerary = (newItinerary: ItineraryData) => {
    setItineraryData(newItinerary);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9] text-[#1a1c1c] font-sans antialiased selection:bg-black selection:text-white">
      {/* Top Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenImageModal={handleOpenImageModal}
        isLiveUpdating={isSyncing}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 md:px-10 py-6 md:py-10">
        {activeTab === 'home' && (
          <DashboardView
            setActiveTab={setActiveTab}
            onOpenImageModal={handleOpenImageModal}
          />
        )}

        {activeTab === 'itinerary' && (
          <ItineraryView
            setActiveTab={setActiveTab}
            onOpenImageModal={handleOpenImageModal}
            itineraryData={itineraryData}
            onRegenerateItinerary={() => setActiveTab('plan')}
          />
        )}

        {activeTab === 'transit' && (
          <TransitView
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'plan' && (
          <PlanView
            setActiveTab={setActiveTab}
            onOpenImageModal={handleOpenImageModal}
            onGeneratedItinerary={handleGeneratedItinerary}
          />
        )}

        {activeTab === 'saved' && (
          <SavedView
            onOpenImageModal={handleOpenImageModal}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Interactive JavaScript Lightbox Modal for Image Clicks */}
      <ImageLightboxModal
        data={modalData}
        onClose={handleCloseImageModal}
      />
    </div>
  );
}
