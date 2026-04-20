'use client';

import { useState, useEffect } from 'react';
import { Navigation } from 'lucide-react';
import MapWrapper from './MapWrapper';
import { subscribeToLocations, shareMyLocation, stopSharingLocation, UserLocation } from '@/services/locationService';
import { getSupabaseClient } from '@/lib/supabase/client';

import { User } from '@supabase/supabase-js';
import Link from 'next/link';

export default function LiveMapSection({ styles, user }: { styles: any, user: User | null }) {
  const [isSharing, setIsSharing] = useState(false);
  const [members, setMembers] = useState<UserLocation[]>([]);
  const [watchId, setWatchId] = useState<number | null>(null);
  
  const [userProfile, setUserProfile] = useState<{ id: string, name: string, role: string, helmet_color?: string } | null>(null);

  useEffect(() => {
    async function loadUser() {
      if (!user) return;
      const supabase = getSupabaseClient();
      if (!supabase) return;
      
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        setUserProfile(data as any);
      }
    }
    loadUser();
  }, [user]);

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
    if (!user) return; // Segurança extra

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
             userProfile?.id || user.id,
             userProfile?.name || "Motoboy",
             latitude,
             longitude,
             userProfile?.role === 'admin',
             userProfile?.helmet_color
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
        <div className={styles.mapContainerOuter}>
           <MapWrapper members={members} />
           
           {!user && (
             <div className={styles.mapLockedOverlay}>
               <div className={styles.lockContent}>
                 <div className={styles.lockIcon}>🔒</div>
                 <h3>Área Restrita</h3>
                 <p>Faça login para ver a localização do Motoboot e de outros motoboys em tempo real.</p>
                 <Link href="/login" className={styles.lockBtn}>
                   ENTRAR AGORA
                 </Link>
               </div>
             </div>
           )}
        </div>

        {/* Legenda do mapa */}
        {user && (
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
        )}
      </section>

      {user && (
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
      )}
    </>
  );
}

