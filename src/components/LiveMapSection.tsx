'use client';

import { useState, useEffect, useCallback } from 'react';
import { Navigation, Lock, MapPin } from 'lucide-react';
import MapWrapper from './MapWrapper';
import {
  subscribeToLocations,
  shareMyLocation,
  stopSharingLocation,
  UserLocation,
} from '@/services/locationService';
import { getSupabaseClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';

type Profile = {
  id: string;
  name: string;
  role: string;
  helmet_color?: string;
};

export default function LiveMapSection({
  styles,
  user,
}: {
  styles: Record<string, string>;
  user: User | null;
}) {
  const [isSharing, setIsSharing] = useState(false);
  const [members, setMembers] = useState<UserLocation[]>([]);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  // ✅ NOVO: sabe se o admin está online
  const [adminOnline, setAdminOnline] = useState(false);

  const isAdmin = userProfile?.role === 'admin';

  // ─── Carrega perfil do usuário ──────────────────────────────
  useEffect(() => {
    async function loadUser() {
      if (!user) return;
      const supabase = getSupabaseClient();
      if (!supabase) return;
      const { data } = await supabase
        .from('profiles')
        .select('id, name, role, helmet_color')
        .eq('id', user.id)
        .single();
      if (data) setUserProfile(data as Profile);
    }
    loadUser();
  }, [user]);

  // ─── Subscreve ao canal de localização ──────────────────────
  useEffect(() => {
    const unsubscribe = subscribeToLocations((activeUsers, adminIsOnline) => {
      setMembers([...activeUsers]);
      setAdminOnline(adminIsOnline);
    });

    return () => {
      if (unsubscribe) unsubscribe();
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        stopSharingLocation();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Para de compartilhar se admin sair e o usuário for common ─
  useEffect(() => {
    if (!adminOnline && isSharing && !isAdmin) {
      // Admin saiu → forçar parada do usuário comum
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsSharing(false);
      stopSharingLocation();
    }
  }, [adminOnline, isSharing, isAdmin, watchId]);

  // ─── Toggle de localização ──────────────────────────────────
  const toggleLocationShare = useCallback(() => {
    if (!user || !userProfile) return;

    if (isSharing) {
      // PARAR
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsSharing(false);
      stopSharingLocation();
    } else {
      // INICIAR
      if (!navigator.geolocation) {
        alert('Geolocalização não é suportada neste navegador.');
        return;
      }

      const id = navigator.geolocation.watchPosition(
        (position) => {
          setIsSharing(true);
          shareMyLocation(
            userProfile.id,
            userProfile.name || 'Motoboy',
            position.coords.latitude,
            position.coords.longitude,
            isAdmin,
            userProfile.helmet_color
          );
        },
        (err) => {
          console.error('Geolocation error:', err);
          alert('Por favor, permita o acesso à localização nas configurações do seu navegador.');
          setIsSharing(false);
        },
        { enableHighAccuracy: true, maximumAge: 10000 }
      );

      setWatchId(id);
    }
  }, [user, userProfile, isSharing, watchId, isAdmin]);

  // ─── Estado do botão para usuários comuns ───────────────────
  // Usuário comum só pode compartilhar SE o admin estiver online
  const isButtonDisabled = !isAdmin && !adminOnline;

  const buttonLabel = () => {
    if (isAdmin) {
      return isSharing ? '🔴 Parar transmissão' : '🟢 Iniciar transmissão Motoboot';
    }
    if (!adminOnline) return '🔒 Aguardando Motoboot...';
    return isSharing ? 'Parar compartilhamento' : 'Compartilhar minha localização';
  };

  const buttonStyle = (): React.CSSProperties => {
    if (isAdmin && isSharing)
      return {
        background: 'linear-gradient(135deg, #EF4444, #DC2626)',
        color: '#fff',
        boxShadow: '0 0 20px rgba(239,68,68,0.5)',
      };
    if (isAdmin && !isSharing)
      return {
        background: 'linear-gradient(135deg, #FF6A00, #FF8C00)',
        color: '#fff',
        boxShadow: '0 0 20px rgba(255,106,0,0.5)',
      };
    if (isButtonDisabled)
      return {
        background: 'rgba(255,255,255,0.05)',
        color: 'var(--text-muted)',
        border: '1px solid var(--border-subtle)',
        cursor: 'not-allowed',
        opacity: 0.7,
      };
    return {
      background: isSharing
        ? 'linear-gradient(135deg, #22C55E, #16A34A)'
        : 'var(--accent)',
      color: '#fff',
    };
  };

  // ─── RENDER ─────────────────────────────────────────────────
  return (
    <>
      <section className={styles.mapArea}>
        <div className={styles.mapContainerOuter}>
          <MapWrapper members={members} />

          {/* Overlay se não logado */}
          {!user && (
            <div className={styles.mapLockedOverlay}>
              <div className={styles.lockContent}>
                <div className={styles.lockIcon}>🔒</div>
                <h3>Área Restrita</h3>
                <p>
                  Faça login para ver a localização do Motoboot e de outros
                  motoboys em tempo real.
                </p>
                <Link href="/login" className={styles.lockBtn}>
                  ENTRAR AGORA
                </Link>
              </div>
            </div>
          )}

          {/* Badge: Admin online/offline — visível para todos logados */}
          {user && (
            <div
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 999,
                background: adminOnline
                  ? 'rgba(255, 106, 0, 0.15)'
                  : 'rgba(255,255,255,0.06)',
                border: `1px solid ${adminOnline ? 'rgba(255,106,0,0.4)' : 'rgba(255,255,255,0.08)'}`,
                backdropFilter: 'blur(8px)',
                fontSize: 12,
                fontWeight: 700,
                color: adminOnline ? '#FF6A00' : 'var(--text-muted)',
                letterSpacing: '0.03em',
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: adminOnline ? '#FF6A00' : '#555',
                  animation: adminOnline ? 'pulse-dot 1.5s ease-in-out infinite' : 'none',
                }}
              />
              {adminOnline ? 'MOTOBOOT ONLINE' : 'MOTOBOOT OFFLINE'}
            </div>
          )}
        </div>

        {/* Legenda */}
        {user && (
          <div className={styles.mapLegend}>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: '#FF6A00', boxShadow: '0 0 6px #FF6A00' }} />
              <span className={styles.legendLabel}>Motoboot (admin)</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: '#22C55E' }} />
              <span className={styles.legendLabel}>Motoboys próximos</span>
            </div>
          </div>
        )}
      </section>

      {/* BOTÃO DE COMPARTILHAR */}
      {user && (
        <div className={styles.locationToggle}>
          {/* Dica para usuários comuns quando admin está offline */}
          {!isAdmin && !adminOnline && (
            <div
              style={{
                textAlign: 'center',
                fontSize: 12,
                color: 'var(--text-muted)',
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <Lock size={12} />
              O mapa ativo é ativado pelo Motoboot. Aguarde o admin entrar online.
            </div>
          )}

          {/* Dica para admin quando não está transmitindo */}
          {isAdmin && !isSharing && (
            <div
              style={{
                textAlign: 'center',
                fontSize: 12,
                color: '#FF6A00',
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              👑 Inicie a transmissão para liberar o mapa para os motoboys
            </div>
          )}

          <button
            className={styles.locationBtn}
            onClick={isButtonDisabled ? undefined : toggleLocationShare}
            style={{
              ...buttonStyle(),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              width: '100%',
              padding: '14px',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              border: 'none',
              transition: 'all 0.25s ease',
            }}
            disabled={isButtonDisabled}
            aria-disabled={isButtonDisabled}
          >
            <Navigation size={18} />
            {buttonLabel()}
          </button>

          {/* Indicador de compartilhamento ativo */}
          {isSharing && (
            <div
              style={{
                textAlign: 'center',
                fontSize: 12,
                color: isAdmin ? '#FF6A00' : '#22C55E',
                marginTop: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                fontWeight: 600,
              }}
            >
              <MapPin size={12} />
              {isAdmin
                ? 'Transmitindo sua localização • Motoboys podem entrar no mapa'
                : 'Compartilhando sua localização em tempo real'}
            </div>
          )}
        </div>
      )}

      {/* CSS inline para o pulse dot */}
      <style jsx global>{`
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.4); opacity: 0.7; }
        }
      `}</style>
    </>
  );
}
