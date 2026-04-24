import { getSupabaseClient } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

// ─── Global channel instance ───────────────────────────────────────────────
let locationChannel: RealtimeChannel | null = null;

export type UserLocation = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  isAdmin: boolean;
  helmetColor?: string;
};

type LocationUpdateCallback = (locations: UserLocation[], adminOnline: boolean) => void;

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Parse raw presence state into UserLocation list */
function parseState(state: Record<string, unknown[]>): UserLocation[] {
  const result: UserLocation[] = [];
  Object.keys(state).forEach((key) => {
    const presences = state[key] as Record<string, unknown>[];
    presences.forEach((p) => {
      if (p.id && typeof p.lat === 'number' && typeof p.lng === 'number') {
        result.push({
          id: p.id as string,
          name: (p.name as string) || 'Motoboy',
          lat: p.lat as number,
          lng: p.lng as number,
          isAdmin: (p.isAdmin as boolean) || false,
          helmetColor: p.helmetColor as string | undefined,
        });
      }
    });
  });
  return result;
}

// ─── Subscribe ─────────────────────────────────────────────────────────────

/**
 * Subscreve ao canal de presença de localização.
 * O callback recebe:
 *  - locations: todos os usuários ativos no mapa
 *  - adminOnline: se há pelo menos UM admin compartilhando agora
 */
export function subscribeToLocations(callback: LocationUpdateCallback) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.warn('[Motoboot] Supabase não configurado — modo mock.');
    return;
  }

  locationChannel = supabase.channel('online-locations', {
    config: { presence: { key: '' } },
  });

  locationChannel
    .on('presence', { event: 'sync' }, () => {
      const state = locationChannel?.presenceState() as Record<string, unknown[]> | undefined;
      if (!state) return;

      const activeUsers = parseState(state);
      // ✅ REGRA CENTRAL: admin online = pelo menos 1 usuário com isAdmin: true
      const adminOnline = activeUsers.some((u) => u.isAdmin);
      callback(activeUsers, adminOnline);
    })
    .subscribe();

  return () => {
    if (locationChannel) {
      supabase.removeChannel(locationChannel);
      locationChannel = null;
    }
  };
}

// ─── Share ─────────────────────────────────────────────────────────────────

/** Transmite a posição atual do usuário pelo canal de presença */
export async function shareMyLocation(
  userId: string,
  name: string,
  lat: number,
  lng: number,
  isAdmin = false,
  helmetColor?: string
): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase || !locationChannel) return false;

  const status = await locationChannel.track({
    id: userId,
    name,
    lat,
    lng,
    isAdmin,
    helmetColor,
  });

  return status === 'ok';
}

// ─── Stop ──────────────────────────────────────────────────────────────────

/** Para de transmitir a localização (untrack do presence) */
export async function stopSharingLocation(): Promise<boolean> {
  if (locationChannel) {
    await locationChannel.untrack();
    return true;
  }
  return false;
}
