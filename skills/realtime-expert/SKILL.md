---
name: realtime-expert
description: Especialista no uso de Supabase Realtime Presence para mapas e status no Next.js.
---

# Skill Realtime & Presence

O app Motoboot usa a funcionalidade **Presence** do Supabase Realtime para transmitir a localização e o status dos usuários, especialmente no mapa interativo.

## Princípios Básicos
- **Nunca salve coordenadas em tempo real direto no banco de dados (Tabelas)** para evitar estouro de limites de gravação (inserts/updates constantes).
- Use **Canais (Channels)** para transmitir o estado (broadcast/presence) de quem está na tela do mapa.

## O Fluxo do Motoboot (Gatilho do Admin)
1. O compartilhamento do mapa é "trancado" por padrão para usuários comuns (Motoboys).
2. Apenas o **Admin (Motoboot)** pode iniciar o compartilhamento.
3. Quando o Admin entra na sala e ativa sua localização, ele envia no state da presença um `{ isMotobootActive: true }`.
4. Os clientes dos outros usuários escutam o evento `sync` da sala. Se detectarem que o Admin está ativo, o botão de "Compartilhar minha localização" é desbloqueado na tela deles.

## Como implementar um Canal de Presença
Sempre implemente em um `useEffect` dentro de um *Client Component* (`'use client'`).

```typescript
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useMapPresence(userId: string, role: string, coordinates: { lat: number, lng: number } | null) {
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [isMotobootActive, setIsMotobootActive] = useState(false);

  useEffect(() => {
    const channel = supabase.channel('motoboot-map');

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users = Object.values(state).flat();
        setActiveUsers(users);
        
        // Verifica se o admin está transmitindo
        const adminOnline = users.some(u => u.role === 'admin' && u.coordinates);
        setIsMotobootActive(adminOnline);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: userId,
            role: role,
            coordinates: coordinates, // Atualize isso sempre que o GPS mudar
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, role, coordinates]);

  return { activeUsers, isMotobootActive };
}
```

## Diretrizes para a IA:
- Quando for codificar o mapa de localização, use o hook acima ou lógica semelhante.
- O canal de presença descarta automaticamente usuários que fecham o app ou perdem a conexão de internet.
