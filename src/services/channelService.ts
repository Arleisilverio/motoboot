/**
 * Channel Service
 * 
 * Handles channel info, alerts, and community features.
 * Currently mock — will integrate with Supabase.
 */

import type { ChannelInfo, Alert } from '@/types/models';

/** Get channel information */
export async function getChannelInfo(): Promise<ChannelInfo> {
  // TODO: Replace with Supabase query
  return {
    name: 'Canal Motoboot',
    description: 'O canal que conecta motoboys de todo o Brasil.',
    whatsappLink: '',
    groupLink: '',
    memberCount: 12400,
    onlineCount: 847,
    messageCount: 45000,
  };
}

/** Get active alerts */
export async function getActiveAlerts(): Promise<Alert[]> {
  // TODO: Replace with Supabase query
  return [];
}

/** Send emergency alert */
export async function sendEmergencyAlert(
  memberId: string,
  lat: number,
  lng: number
): Promise<boolean> {
  // TODO: Replace with Supabase insert + push notification
  console.log(`[Motoboot] EMERGENCY from ${memberId} at ${lat}, ${lng}`);
  return true;
}
