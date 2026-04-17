/**
 * Location Service
 * 
 * Handles geolocation and real-time location sharing.
 * Currently mock — will integrate with Supabase Realtime.
 */

/** Get admin's current location */
export async function getAdminLocation(): Promise<{ lat: number; lng: number } | null> {
  // TODO: Replace with Supabase realtime subscription
  return null;
}

/** Share current user's location */
export async function shareMyLocation(
  lat: number,
  lng: number
): Promise<boolean> {
  // TODO: Replace with Supabase upsert + realtime broadcast
  console.log(`[Motoboot] Sharing location: ${lat}, ${lng}`);
  return true;
}

/** Stop sharing location */
export async function stopSharingLocation(): Promise<boolean> {
  // TODO: Replace with Supabase delete
  return true;
}

/** Get nearby members who are sharing their location */
export async function getNearbyMembers(): Promise<
  Array<{ id: string; name: string; lat: number; lng: number }>
> {
  // TODO: Replace with Supabase query
  return [];
}
