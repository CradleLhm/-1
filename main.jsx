import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, User } from 'lucide-react';
import { MAP_DATA } from '../data/mockData';

const SearchBox = ({ onClose, onNavigate }) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const searchTerms = query.toLowerCase().split(' ');
    const found = [];

    [4, 5].forEach(floor => {
      MAP_DATA[floor].rooms.forEach(room => {
        const roomMatch = room.id.toLowerCase().includes(query.toLowerCase()) || 
                          room.name.toLowerCase().includes(query.toLowerCase());
        
        const teacherMatches = room.content.filter(unit => {
          const searchable = [unit.title, unit.body, unit.subtitle, unit.description, unit.text, unit.caption, unit.attribution]
            .filter(Boolean)
            .join(' ');
          return searchable.toLowerCase().includes(query.toLowerCase());
        });

        if (roomMatch || teacherMatches.length > 0) {
          found.push({
            floor,
            room,
            teacherMatches
          });
        }
      });
    });
    return found;
  }, [query]);

  return (
    <motion.div 
      className="blur-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '15vh',
        zIndex: 1000
      }}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '600px',
          background: 'transparent',
          position: 'relative'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '2px solid #000',
          paddingBottom: '10px'
        }}>
          <Search size={24} style={{ marginRight: '15px' }} />
          <input 
            autoFocus
            type="text"
            placeholder="Search room (e.g. 401) or teacher..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '2rem',
              outline: 'none',
              width: '100%',
              fontWeight: '200',
              fontFamily: 'inherit'
            }}
          />
        </div>
        
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: '20px',
              background: 'rgba(255,255,255,0.95)',
              padding: '10px',
              borderRadius: '8px',
              maxHeight: '50vh',
              overflowY: 'auto',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}
          >
            {results.map(({ floor, room, teacherMatches }) => (
              <div 
                key={`${floor}-${room.id}`}
                onClick={() => {
                  onNavigate(floor, room);
                  onClose();
                }}
                style={{
                  padding: '15px',
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                className="search-result-item"
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <MapPin size={14} color="#666" />
                    <span style={{ fontWeight: '600' }}>{room.id}</span>
                    <span style={{ color: '#888' }}>{room.name}</span>
                  </div>
                  {teacherMatches.length > 0 && (
                    <div style={{ display: 'flex', gap: '10px', fontSize: '0.85rem', color: '#555' }}>
                      <User size={14} />
                      {teacherMatches.map(t => t.title).join(', ')}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#888', background: '#f0f0f0', padding: '2px 8px', borderRadius: '4px' }}>
                  {floor}F
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SearchBox;
