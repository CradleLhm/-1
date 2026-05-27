import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import MapContainer from './components/MapContainer';
import InfoPanel from './components/InfoPanel';
import UIOverlay from './components/UIOverlay';
import SearchBox from './components/SearchBox';

function App() {
  const [floor, setFloor] = useState(() => parseInt(sessionStorage.getItem('floor')) || 4);
  const [layoutState, setLayoutState] = useState('CENTER');
  const [activeRoom, setActiveRoom] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Handle Floor Switching (Throttled)
  const [isTransitioning, setIsTransitioning] = useState(false);
  const handleWheel = useCallback((e) => {
    if (isTransitioning || isSearchOpen || layoutState === 'DETAIL_LEFT') return;

    if (e.deltaY < -20 && floor === 4) {
      setIsTransitioning(true);
      setFloor(5);
      setTimeout(() => setIsTransitioning(false), 800);
    } else if (e.deltaY > 20 && floor === 5) {
      setIsTransitioning(true);
      setFloor(4);
      setTimeout(() => setIsTransitioning(false), 800);
    }
  }, [floor, isTransitioning, isSearchOpen, layoutState]);

  useEffect(() => {
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Handle Tab for Search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        const tag = e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        if (layoutState === 'DETAIL_LEFT') {
          setLayoutState('HOVER_LEFT');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [layoutState]);

  const handleRoomClick = (room) => {
    setActiveRoom(room);
    setLayoutState('DETAIL_LEFT');
  };

  const handleMapEnter = () => {
    if (isSearchOpen) return;
    if (layoutState === 'CENTER') setLayoutState('HOVER_LEFT');
  };

  const handleMapLeave = () => {
    if (layoutState === 'HOVER_LEFT') {
      setLayoutState('CENTER');
      setActiveRoom(null);
    }
  };

  const handleRoomHover = (room) => {
    if (layoutState === 'DETAIL_LEFT') return;
    setActiveRoom(room);
  };

  return (
    <div className="app-container" style={{ width: '100%', height: '100%', position: 'relative' }}>

      {/* Background Map Container */}
      <MapContainer
        floor={floor}
        layoutState={layoutState}
        setLayoutState={setLayoutState}
        activeRoom={activeRoom}
        setActiveRoom={setActiveRoom}
        isSearchOpen={isSearchOpen}
        onRoomClick={handleRoomClick}
        onMapEnter={handleMapEnter}
        onMapLeave={handleMapLeave}
        onRoomHover={handleRoomHover}
      />

      {/* Persistent UI Elements */}
      <UIOverlay
        floor={floor}
        setFloor={setFloor}
        showSearchPrompt={layoutState !== 'DETAIL_LEFT' && !isSearchOpen}
      />

      {/* Info Panels */}
      <InfoPanel
        layoutState={layoutState}
        activeRoom={activeRoom}
        onClose={() => setLayoutState('HOVER_LEFT')}
      />

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <SearchBox
            onClose={() => setIsSearchOpen(false)}
            onNavigate={(targetFloor, room) => {
              setFloor(targetFloor);
              setActiveRoom(room);
              setLayoutState('DETAIL_LEFT');
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;
