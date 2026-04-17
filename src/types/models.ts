/**
 * Motoboot — Modelos do Canal de Comunidade
 */

/** Membro da comunidade */
export interface Member {
  id: string;
  name: string;
  nickname?: string;
  avatarUrl?: string;
  isAdmin: boolean;
  isOnline: boolean;
  latitude?: number;
  longitude?: number;
  locationSharingEnabled: boolean;
  joinedAt: string;
}

/** Alerta da comunidade */
export interface Alert {
  id: string;
  type: 'blitz' | 'transito' | 'perigo' | 'info' | 'emergencia';
  title: string;
  description: string;
  latitude?: number;
  longitude?: number;
  createdBy: string;
  createdAt: string;
  active: boolean;
}

/** Resultado da calculadora de KM */
export interface KmCalculation {
  distanceKm: number;
  estimatedCostFuel: number;
  estimatedTime: string;
}

/** Status de emergência */
export interface EmergencyAlert {
  id: string;
  memberId: string;
  memberName: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  resolved: boolean;
}

/** Configurações do canal */
export interface ChannelInfo {
  name: string;
  description: string;
  whatsappLink: string;
  groupLink: string;
  memberCount: number;
  onlineCount: number;
  messageCount: number;
}
