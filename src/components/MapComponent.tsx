'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
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

// ─── CSS de animação injetado uma única vez ───────────────────────────────
const injectMapStyles = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById('motoboot-map-styles')) return;

  const style = document.createElement('style');
  style.id = 'motoboot-map-styles';
  style.textContent = `
    /* Pulse ring do admin */
    @keyframes adminPulse {
      0%   { transform: scale(1);   opacity: 0.8; }
      50%  { transform: scale(1.3); opacity: 0.3; }
      100% { transform: scale(1.6); opacity: 0;   }
    }
    @keyframes adminGlow {
      0%, 100% { filter: drop-shadow(0 0 8px rgba(255,106,0,0.9)) drop-shadow(0 0 16px rgba(255,106,0,0.5)); }
      50%       { filter: drop-shadow(0 0 14px rgba(255,106,0,1))  drop-shadow(0 0 28px rgba(255,106,0,0.7)); }
    }
    @keyframes userGlow {
      0%, 100% { filter: drop-shadow(0 0 5px var(--helmet-color, #22C55E)); }
      50%       { filter: drop-shadow(0 0 10px var(--helmet-color, #22C55E)); }
    }

    .admin-helmet-wrap {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .admin-helmet-wrap .pulse-ring {
      position: absolute;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: 2px solid rgba(255, 106, 0, 0.8);
      animation: adminPulse 1.8s ease-out infinite;
    }
    .admin-helmet-wrap .pulse-ring-2 {
      animation-delay: 0.6s;
    }
    .admin-helmet-svg {
      animation: adminGlow 2s ease-in-out infinite;
      position: relative;
      z-index: 2;
    }
    .user-helmet-svg {
      animation: userGlow 2.5s ease-in-out infinite;
    }
    .leaflet-popup-content-wrapper {
      background: #1A1A1A !important;
      border: 1px solid #333 !important;
      border-radius: 12px !important;
      color: #F2F2F2 !important;
      box-shadow: 0 8px 24px rgba(0,0,0,0.6) !important;
    }
    .leaflet-popup-tip { background: #1A1A1A !important; }
    .leaflet-popup-close-button { color: #666 !important; }
  `;
  document.head.appendChild(style);
};

// ─── Gerador de ícone SVG do ADMIN (maior, brilhando, com anéis de pulse) ─
const createAdminIcon = () => {
  injectMapStyles();
  const size = 52;
  return L.divIcon({
    className: '',
    html: `
      <div class="admin-helmet-wrap" style="width:${size}px;height:${size}px">
        <div class="pulse-ring"></div>
        <div class="pulse-ring pulse-ring-2"></div>
        <svg class="admin-helmet-svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Coroa acima do capacete -->
          <path d="M8.5 5L12 3L15.5 5L14 2H10L8.5 5Z" fill="#FFC300" />
          <!-- Shell principal -->
          <path d="M12 4C7.58 4 4 7.58 4 12C4 13.23 4.28 14.39 4.78 15.42C4.1 16.43 3.65 17.6 3.55 18.85C3.41 20.23 4.35 21.5 5.73 21.5H18.27C19.65 21.5 20.59 20.23 20.45 18.85C20.35 17.6 19.9 16.43 19.22 15.42C19.72 14.39 20 13.23 20 12C20 7.58 16.42 4 12 4Z" fill="#FF6A00" stroke="#fff" stroke-width="1.2"/>
          <!-- Visor -->
          <path d="M7 12C7 10 9 9 12 9C15 9 17 10 17 12V14H7V12Z" fill="#1E293B" fill-opacity="0.92"/>
          <!-- Reflexo -->
          <path d="M12 6.5C9.5 6.5 7.5 8.5 7.5 11L12 10.5L16.5 11C16.5 8.5 14.5 6.5 12 6.5Z" fill="white" fill-opacity="0.25"/>
          <!-- Detalhe lateral -->
          <path d="M4.5 12C4.5 12 5 10 6 9.5" stroke="white" stroke-width="0.8" stroke-linecap="round" opacity="0.4"/>
        </svg>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
};

// ─── Gerador de ícone SVG do USUÁRIO COMUM ────────────────────────────────
const createUserIcon = (color: string) => {
  injectMapStyles();
  const size = 36;
  // Usa a cor como variável CSS inline para a animação de glow
  return L.divIcon({
    className: '',
    html: `
      <div style="--helmet-color:${color}80">
        <svg class="user-helmet-svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C7.58 2 4 5.58 4 10C4 11.23 4.28 12.39 4.78 13.42C4.1 14.43 3.65 15.6 3.55 16.85C3.41 18.23 4.35 19.5 5.73 19.5H18.27C19.65 19.5 20.59 18.23 20.45 16.85C20.35 15.6 19.9 14.43 19.22 13.42C19.72 12.39 20 11.23 20 10C20 5.58 16.42 2 12 2Z" fill="${color}" stroke="#fff" stroke-width="1.2"/>
          <path d="M7 10C7 8 9 7 12 7C15 7 17 8 17 10V12H7V10Z" fill="#1E293B" fill-opacity="0.9"/>
          <path d="M12 4.5C9.5 4.5 7.5 6.5 7.5 9L12 8.5L16.5 9C16.5 6.5 14.5 4.5 12 4.5Z" fill="white" fill-opacity="0.2"/>
        </svg>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
};

// ─── Auto-ajuste de bounds ────────────────────────────────────────────────
function AutoFitBounds({ members }: { members: MapMember[] }) {
  const map = useMap();
  const initialized = useRef(false);

  useEffect(() => {
    if (members.length > 0 && !initialized.current) {
      const bounds = L.latLngBounds(members.map((m) => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
      initialized.current = true;
    }
  }, [members, map]);

  return null;
}

// ─── Component principal ──────────────────────────────────────────────────
export default function MapComponent({ members, centerLat, centerLng }: MapComponentProps) {
  const defaultPosition: [number, number] = [centerLat || -25.4284, centerLng || -49.2733];

  if (typeof window === 'undefined') return null;

  return (
    <MapContainer
      center={defaultPosition}
      zoom={13}
      style={{ height: '100%', width: '100%', borderRadius: '16px', zIndex: 0 }}
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
          icon={
            member.isAdmin
              ? createAdminIcon()
              : createUserIcon(member.helmetColor || '#22C55E')
          }
          // Admin fica sempre no topo (zIndexOffset)
          zIndexOffset={member.isAdmin ? 1000 : 0}
        >
          <Popup>
            <div style={{ textAlign: 'center', minWidth: '110px', fontFamily: 'Inter, sans-serif' }}>
              {member.isAdmin && (
                <div style={{ fontSize: 18, marginBottom: 4 }}>👑</div>
              )}
              <div style={{ fontWeight: 700, fontSize: 14, color: '#F2F2F2', marginBottom: 4 }}>
                {member.name}
              </div>
              <div
                style={{
                  color: member.isAdmin ? '#FF6A00' : (member.helmetColor || '#22C55E'),
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {member.isAdmin ? '🏍️ Motoboot Online' : '📍 Online'}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
