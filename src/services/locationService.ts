import { getSupabaseClient } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

// Global channel instance
let locationChannel: RealtimeChannel | null = null;

export type UserLocation = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  isAdmin: boolean;
  helmetColor?: string;
};

type LocationUpdateCallback = (locations: UserLocation[]) => void;

/**
 * Join the locations channel and subscribe to presence.
 */
export function subscribeToLocations(
  callback: LocationUpdateCallback
) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.warn('[Motoboot] Mocking locations (Supabase not configured)');
    return;
  }

  locationChannel = supabase.channel('online-locations', {
    config: {
      presence: {
        key: '', // Default
      },
    },
  });

  locationChannel
    .on('presence', { event: 'sync' }, () => {
      const state = locationChannel?.presenceState();
      if (!state) return;

      const activeUsers: UserLocation[] = [];
      Object.keys(state).forEach((presenceId) => {
        const presences = state[presenceId] as any[];
        presences.forEach((p) => {
          if (p.id && typeof p.lat === 'number' && typeof p.lng === 'number') {
            activeUsers.push({
              id: p.id,
              name: p.name || 'Motoboy',
              lat: p.lat,
              lng: p.lng,
              isAdmin: p.isAdmin || false,
              helmetColor: p.helmetColor,
            });
          }
        });
      });

      callback(activeUsers);
    })
    .subscribe();

  return () => {
    if (locationChannel) {
      supabase.removeChannel(locationChannel);
      locationChannel = null;
    }
  };
}

/** Share current user's location */
export async function shareMyLocation(
  userId: string,
  name: string,
  lat: number,
  lng: number,
  isAdmin = false,
  helmetColor?: string
): Promise<boolean> {
  const supabase = getSupabaseClient();
  
  if (!supabase || !locationChannel) {
    if (!supabase) console.log(`[Motoboot Mock] Sharing location: ${lat}, ${lng} (No realtime connection)`);
    return false;
  }

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

/** Stop sharing location */
export async function stopSharingLocation(): Promise<boolean> {
  if (locationChannel) {
    await locationChannel.untrack();
    return true;
  }
  return false;
}
