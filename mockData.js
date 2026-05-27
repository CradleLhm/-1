import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const sharedBlockStyle = {
  marginBottom: '40px',
};

const blockTitleStyle = {
  fontSize: '1.2rem',
  fontWeight: '500',
};

const blockSubtitleStyle = {
  fontSize: '0.85rem',
  color: '#888',
};

const blockBodyStyle = {
  color: '#666',
  fontSize: '0.85rem',
  marginTop: '10px',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap',
};

function ContentBlock({ unit }) {
  const type = unit.type || 'card';

  switch (type) {
    case 'text':
      return (
        <div style={sharedBlockStyle}>
          {unit.title && <h3 style={blockTitleStyle}>{unit.title}</h3>}
          {unit.body && <p style={blockBodyStyle}>{unit.body}</p>}
        </div>
      );

    case 'image':
      return (
        <div style={sharedBlockStyle}>
          <img
            src={unit.url}
            alt={unit.caption || ''}
            style={{
              width: '100%',
              maxHeight: '220px',
              objectFit: 'cover',
                            background: '#e0e0e0',
            }}
          />
          {unit.caption && (
            <p style={{ ...blockBodyStyle, fontSize: '0.8rem', color: '#888', marginTop: '6px' }}>
              {unit.caption}
            </p>
          )}
        </div>
      );

    case 'quote':
      return (
        <div style={{
          ...sharedBlockStyle,
          borderLeft: '3px solid #ccc',
          paddingLeft: '20px',
          fontStyle: 'italic',
        }}>
          <p style={{ ...blockBodyStyle, fontSize: '1rem', fontStyle: 'italic' }}>
            "{unit.text}"
          </p>
          {unit.attribution && (
            <p style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '8px' }}>
              — {unit.attribution}
            </p>
          )}
        </div>
      );

    case 'card':
    default:
      return (
        <div style={{ display: 'flex', gap: '40px', ...sharedBlockStyle }}>
          <img
            src={unit.photo}
            alt={unit.title}
            style={{
              width: '100px',
              height: '140px',
              objectFit: 'cover',
                            background: '#e0e0e0',
            }}
          />
          <div>
            <h3 style={blockTitleStyle}>{unit.title}</h3>
            <h4 style={blockSubtitleStyle}>{unit.subtitle}</h4>
            <p style={blockBodyStyle}>{unit.description}</p>
          </div>
        </div>
      );
  }
}

const InfoPanel = ({ layoutState, activeRoom, onClose }) => {
  const isDetail = layoutState === 'DETAIL_LEFT';
  const isHover = layoutState === 'HOVER_LEFT';

  const sharedSpring = { 
    type: 'spring', 
    stiffness: 80, 
    damping: 20,
    mass: 1
  };

  return (
    <AnimatePresence>
      {(isHover || isDetail) && activeRoom && (
        <motion.div
          key="info-panel-root" // Stable key is critical
          variants={{
            initial: { x: 60, opacity: 0 },
            animate: { x: 0, opacity: 1 },
            exit: { x: 180, opacity: 0 }
          }}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            x: sharedSpring,
            opacity: { duration: 0.18 }
          }}
          style={{
            position: 'fixed',
            right: 0,
            top: 0,
            height: '100vh',
            width: '45vw',
            background: 'transparent',
            padding: '5vh 6vw 5vh 0', 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
            zIndex: 50,
            pointerEvents: isDetail ? 'auto' : 'none'
            }}
            >
            <div style={{ width: '100%', maxWidth: '30vw' }}>
 {/* Slightly narrower max-width */}
            {/* Unified Layout Container */}
            <motion.div layout transition={sharedSpring} style={{ textAlign: 'left' }}>
              <motion.h1 
                layout="position"
                style={{ 
                  fontSize: isDetail ? '4rem' : '2.5rem', 
                  fontWeight: '200',
                  marginBottom: '5px',
                  lineHeight: 1,
                  originX: 0
                }}
              >
                {activeRoom.id}
              </motion.h1>

              <motion.h2 
                layout="position"
                style={{ 
                  fontSize: isDetail ? '1.6rem' : '1.2rem', 
                  fontWeight: '400', 
                  color: '#1a1a1a',
                  marginBottom: '20px',
                  opacity: 0.8,
                  originX: 0
                }}
              >
                {activeRoom.name}
              </motion.h2>
              
              <motion.p
                layout="position"
                style={{
                  fontSize: '1rem',
                  color: '#444',
                  lineHeight: '1.6',
                  opacity: 0.9,
                  maxWidth: '450px',
                  originX: 0,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {activeRoom.brief}
              </motion.p>
            </motion.div>

            {/* Sub-elements use opacity only to avoid layout shifts */}
            <motion.div
              animate={{ opacity: !isDetail ? 1 : 0, y: !isDetail ? 0 : 10 }}
              transition={{ duration: 0.2 }}
              style={{ 
                marginTop: '30px', 
                fontSize: '0.75rem', 
                letterSpacing: '0.25em', 
                color: '#aaa',
                fontWeight: '600',
                display: isDetail ? 'none' : 'block'
              }}
            >
              CLICK FOR MORE DETAILS
            </motion.div>

            <motion.div 
              animate={{ opacity: isDetail ? 1 : 0, y: isDetail ? 0 : 20 }}
              transition={sharedSpring}
              style={{ 
                marginTop: '40px',
                maxHeight: '40vh',
                overflowY: 'auto',
                paddingRight: '20px',
                display: isDetail ? 'block' : 'none'
              }}
            >
              {activeRoom.content.map((unit) => (
                <ContentBlock key={unit.id} unit={unit} />
              ))}
            </motion.div>
          </div>

          {isDetail && (
            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              onClick={onClose}
              style={{ position: 'absolute', top: '60px', right: '60px', border: 'none', background: 'none', cursor: 'pointer' }}
            >
              <X size={24} />
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InfoPanel;
