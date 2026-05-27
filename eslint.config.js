import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UIOverlay = ({ floor, setFloor, showSearchPrompt }) => {
  return (
    <>
      {/* Floor Indicator & Scroll Hints */}
      <div style={{
        position: 'fixed',
        right: '40px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 60
      }}>
        {/* Up chevron slot — fixed height to prevent layout shift */}
        <div style={{ height: '28px', display: 'flex', alignItems: 'center' }}>
          <AnimatePresence>
            {floor === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <ChevronUp size={20} strokeWidth={1.5} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <span style={{
          fontSize: '2rem',
          fontWeight: '300',
          letterSpacing: '0.1em',
          writingMode: 'vertical-lr',
          textOrientation: 'mixed',
          margin: '12px 0',
        }}>
          {floor}th
        </span>

        {/* Down chevron slot — fixed height to prevent layout shift */}
        <div style={{ height: '28px', display: 'flex', alignItems: 'center' }}>
          <AnimatePresence>
            {floor === 5 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <ChevronDown size={20} strokeWidth={1.5} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Title */}
      <div style={{
        position: 'fixed',
        left: '40px',
        top: '40px',
        fontSize: '2.2rem',
        fontWeight: '200',
        letterSpacing: '0.08em',
        color: '#1a1a1a',
        zIndex: 60,
      }}>
        Navigation
      </div>

      {/* Search Prompt */}
      <AnimatePresence>
        {showSearchPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: 'fixed',
              left: '40px',
              bottom: '40px',
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              color: '#888',
              zIndex: 60
            }}
          >
            PRESS TAB TO SEARCH
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UIOverlay;
