'use client';

import { useState, useEffect } from 'react';
import { Navigation } from 'lucide-react';
import MapWrapper from './MapWrapper';
import { subscribeToLocations, shareMyLocation, stopSharingLocation, UserLocation } from '@/services/locationService';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function LiveMapSection({ styles }: { styles: any }) {
  const [isSharing, setIsSharing] = useState(false);
  const [members, setMembers] = useState<UserLocation[]>([]);
  const [watchId, setWatchId] = useState<number | null>(null);
  
  const [userProfile, setUserProfile] = useState<{ id: string, name: string, role: string } | null>(null);
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 9));

  useEffect(() => {
    async function loadUser() {
      const supabase = getSupabaseClient();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (data) {
          setUserProfile(data as any);
        }
      }
    }
    loadUser();
  }, []);

  useEffect(() => {
    // Inscreve no canal de tempo real
    const unsubscribe = subscribeToLocations((activeUsers) => {
      setMembers([...activeUsers]);
    });

    return () => {
      if (unsubscribe) unsubscribe();
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        stopSharingLocation();
      }
    };
  }, [watchId]);

  const toggleLocationShare = () => {
    if (isSharing) {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsSharing(false);
      stopSharingLocation();
    } else {
      if (!navigator.geolocation) {
        alert("Geolocalização não é suportada por este navegador.");
        return;
      }
      
      const id = navigator.geolocation.watchPosition(
        (position) => {
          setIsSharing(true);
          const { latitude, longitude } = position.coords;
          
          shareMyLocation(
             userProfile?.id || sessionId,
             userProfile?.name || "Motoboy anônimo",
             latitude,
             longitude,
             userProfile?.role === 'admin'
          );
        },
        (error) => {
          console.error("Erro ao obter localização", error);
          alert("Por favor, permita o acesso à localização para compartilhar.");
          setIsSharing(false);
        },
        { enableHighAccuracy: true, maximumAge: 10000 }
      );
      
      setWatchId(id);
    }
  };

  return (
    <>
      <section className={styles.mapArea}>
        <div style={{ width: '100%', height: '300px', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
           <MapWrapper members={members} />
        </div>

        {/* Legenda do mapa */}
        <div className={styles.mapLegend}>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#FF6A00' }} />
            <span className={styles.legendLabel}>Motoboot (online)</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#22C55E' }} />
            <span className={styles.legendLabel}>Motoboys próximos</span>
          </div>
        </div>
      </section>

      <div className={styles.locationToggle}>
        <button 
          className={styles.locationBtn} 
          onClick={toggleLocationShare}
          style={{ background: isSharing ? '#22C55E' : 'var(--accent)', color: isSharing ? '#fff' : '#000' }}
        >
          <Navigation size={18} />
          {isSharing ? 'Parar de compartilhar' : 'Compartilhar minha localização'}
        </button>
      </div>
    </>
  );
}

