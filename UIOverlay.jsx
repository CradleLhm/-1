import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MAP_DATA } from '../data/mockData';

const BASE_W = 800;

const FloorMap = ({ floor, onRoomHover, onRoomClick, onMapEnter, onMapLeave }) => {
  const data = MAP_DATA[floor];
  const sensorRef = useRef(null);
  const insideRef = useRef(false);

  useEffect(() => {
    insideRef.current = false;
  }, [floor]);

  if (!data) return null;

  const vw = data.width || 800;
  const vh = data.height || 600;
  const scale = vw / BASE_W;

  // Add padding around floor 5 to reduce its display size
  const pad = floor === 5 ? 0.18 : 0;
  const vx = -(vw * pad);
  const vy = -(vh * pad);
  const vvw = vw * (1 + pad * 2);
  const vvh = vh * (1 + pad * 2);

  const handleMouseMove = (e) => {
    const sensor = sensorRef.current;
    if (!sensor) return;

    const svgEl = e.currentTarget;
    const pt = svgEl.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svgEl.getScreenCTM();
    if (!ctm) return;
    const svgPt = pt.matrixTransform(ctm.inverse());

    let isInside = false;
    try {
      isInside = sensor.isPointInFill(svgPt);
    } catch (_) {
      const bbox = sensor.getBBox();
      isInside = svgPt.x >= bbox.x && svgPt.x <= bbox.x + bbox.width &&
                 svgPt.y >= bbox.y && svgPt.y <= bbox.y + bbox.height;
    }

    if (isInside && !insideRef.current) {
      insideRef.current = true;
      onMapEnter?.();
    } else if (!isInside && insideRef.current) {
      insideRef.current = false;
      onMapLeave?.();
    }
  };

  const handleMouseLeave = () => {
    if (insideRef.current) {
      insideRef.current = false;
      onMapLeave?.();
    }
  };

  return (
    <svg
      viewBox={`${vx} ${vy} ${vvw} ${vvh}`}
      style={{ width: '100%', height: '100%', overflow: 'visible' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Invisible sensor to define the hit area matching the dashed outline */}
      {data.outline ? (
        <path
          ref={sensorRef}
          d={data.outline}
          fill="white"
          fillOpacity="0"
          stroke="none"
          pointerEvents="fill"
        />
      ) : (
        <rect
          ref={sensorRef}
          x={20 * scale}
          y={20 * scale}
          width={vw - 40 * scale}
          height={vh - 40 * scale}
          fill="white"
          fillOpacity="0"
          stroke="none"
          pointerEvents="fill"
        />
      )}

      {/* Background outline */}
      {data.outline ? (
        <path
          d={data.outline}
          fill="none" stroke="#000" strokeWidth={1 * scale}
          strokeDasharray={`${5 * scale},${5 * scale}`} opacity={0.1}
        />
      ) : (
        <rect
          x={20 * scale} y={20 * scale}
          width={vw - 40 * scale} height={vh - 40 * scale}
          fill="none" stroke="#000" strokeWidth={1 * scale}
          strokeDasharray={`${5 * scale},${5 * scale}`} opacity={0.1}
        />
      )}

      {data.rooms.map((room) => (
        <motion.g
          key={room.id}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => onRoomHover(room)}
          onClick={() => onRoomClick(room)}
        >
          <motion.polygon
            points={room.points}
            fill="transparent"
            stroke="#000"
            strokeWidth={2 * scale}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          <text
            x={getCentroid(room.points).x}
            y={getCentroid(room.points).y}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontSize: `${14 * scale}px`,
              fontWeight: '500',
              pointerEvents: 'none',
              userSelect: 'none'
            }}
          >
            {room.label}
          </text>
        </motion.g>
      ))}
    </svg>
  );
};

// Helper to find the center of a polygon for the label
function getCentroid(pointsString) {
  const pts = pointsString.split(' ').map(p => p.split(',').map(Number));
  const x = pts.reduce((sum, p) => sum + p[0], 0) / pts.length;
  const y = pts.reduce((sum, p) => sum + p[1], 0) / pts.length;
  return { x, y };
}

export default FloorMap;
