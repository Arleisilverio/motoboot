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
};

type MapComponentProps = {
  members: MapMember[];
  centerLat?: number;
  centerLng?: number;
};

// Custom icons using standard HTML/CSS for a glowing blip effect
const createMotobootIcon = () =>
  L.divIcon({
    className: 'custom-icon admin-icon',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background-color: #FF6A00;
        border-radius: 50%;
        border: 3px solid #fff;
        box-shadow: 0 0 10px rgba(255, 106, 0, 0.8);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });

const createUserIcon = () =>
  L.divIcon({
    className: 'custom-icon user-icon',
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background-color: #22C55E;
        border-radius: 50%;
        border: 2px solid #fff;
        box-shadow: 0 0 10px rgba(34, 197, 94, 0.8);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });

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
  // Config padrão (Curitiba ou localização do usuário)
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
          icon={member.isAdmin ? createMotobootIcon() : createUserIcon()}
        >
          <Popup>
            <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
              {member.name}
            </div>
            {member.isAdmin && (
              <div style={{ color: '#FF6A00', fontSize: '12px', textAlign: 'center' }}>
                Online
              </div>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
