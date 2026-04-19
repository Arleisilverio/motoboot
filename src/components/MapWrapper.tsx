'use client';

import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#ff6a00' }}>
      Carregando mapa...
    </div>
  ),
});

export default MapComponent;
