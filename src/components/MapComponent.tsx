'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// Fixes default icon issues in Next.js
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { useEffect, useRef } from 'react';

export type MapMember = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  isAdmin: boolean;
  helmetColor?: string;
};

type MapComponentProps = {
  members: MapMember[];
  centerLat?: number;
  centerLng?: number;
};

// SVG Helmet Icon Generator
const createHelmetIcon = (color: string, isAdmin: boolean) => {
  const size = isAdmin ? 42 : 36;
  const glow = isAdmin ? 'filter: drop-shadow(0 0 8px rgba(255, 106, 0, 0.8));' : `filter: drop-shadow(0 0 5px ${color}80);`;
  
  return L.divIcon({
    className: 'custom-helmet-icon',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; ${glow}">
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Main Shell -->
          <path d="M12 2C7.58 2 4 5.58 4 10C4 11.23 4.28 12.39 4.78 13.42C4.1 14.43 3.65 15.6 3.55 16.85C3.41 18.23 4.35 19.5 5.73 19.5H18.27C19.65 19.5 20.59 18.23 20.45 16.85C20.35 15.6 19.9 14.43 19.22 13.42C19.72 12.39 20 11.23 20 10C20 5.58 16.42 2 12 2Z" fill="${color}" stroke="#fff" stroke-width="1.2"/>
          <!-- Visor -->
          <path d="M7 10C7 8 9 7 12 7C15 7 17 8 17 10V12H7V10Z" fill="#1E293B" fill-opacity="0.9"/>
          <!-- Detail -->
          <path d="M12 4.5C9.5 4.5 7.5 6.5 7.5 9L12 8.5L16.5 9C16.5 6.5 14.5 4.5 12 4.5Z" fill="white" fill-opacity="0.2"/>
        </svg>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

// Component to dynamically adjust view to fit members if needed
function AutoFitBounds({ members }: { members: MapMember[] }) {
  const map = useMap();
  const initialized = useRef(false);

  useEffect(() => {
    if (members.length > 0 && !initialized.current) {
      const bounds = L.latLngBounds(members.map((m) => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      initialized.current = true;
    }
  }, [members, map]);

  return null;
}

export default function MapComponent({ members, centerLat, centerLng }: MapComponentProps) {
  const defaultPosition: [number, number] = [centerLat || -25.4284, centerLng || -49.2733]; 

  if (typeof window === 'undefined') return null;

  return (
    <MapContainer
      center={defaultPosition}
      zoom={13}
      style={{
        height: '100%',
        width: '100%',
        borderRadius: '16px',
        zIndex: 0, 
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      {members.length > 0 && <AutoFitBounds members={members} />}

      {members.map((member) => (
        <Marker
          key={member.id}
          position={[member.lat, member.lng]}
          icon={createHelmetIcon(
            member.isAdmin ? '#FF6A00' : (member.helmetColor || '#22C55E'),
            member.isAdmin
          )}
        >
          <Popup>
            <div style={{ textAlign: 'center', minWidth: '100px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>
                {member.name}
              </div>
              <div style={{ 
                color: member.isAdmin ? '#FF6A00' : member.helmetColor || '#22C55E', 
                fontSize: '11px', 
                fontWeight: '800',
                textTransform: 'uppercase'
              }}>
                {member.isAdmin ? '👑 Motoboot Online' : '📍 Online'}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
