---
name: maps-expert
description: Especialista em mapas e geolocalização no Next.js usando Leaflet (react-leaflet).
---

# Skill maps 

Trabalhar com mapas no Next.js (especialmente nas versões mais recentes que utilizam o App Router) exige um cuidado especial com o ciclo de vida da renderização. O Leaflet é uma biblioteca que depende diretamente do objeto window e do DOM para funcionar, o que entra em conflito com a Renderização no Lado do Servidor (SSR) do Next.js.

Aqui está a estrutura técnica para implementar e ensinar o uso correto do Leaflet no Next.js 16.

## O Problema: ReferenceError: window is not defined
Este erro ocorre porque o Next.js tenta pré-renderizar seus componentes no servidor (Node.js). Como o servidor não possui um navegador, ele não conhece o objeto window. O Leaflet, ao ser importado, tenta acessar propriedades globais do navegador imediatamente, quebrando o build ou a execução.

## A Solução: Importação Dinâmica (CSR-Only)
Para resolver isso, devemos forçar o componente de mapa a ser carregado apenas no lado do cliente (Client-Side Rendering).

### 1. Criando o Componente de Mapa (Map.tsx)
Este arquivo conterá a lógica do Leaflet. Use a diretiva 'use client'.

```tsx
'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correção para ícones padrão do Leaflet no Next.js
const icon = L.icon({ iconUrl: '/marker-icon.png' });

export default function Map() {
  return (
    <MapContainer center={[-25.429, -49.267]} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[-25.429, -49.267]} icon={icon}>
        <Popup>Localização em tempo real.</Popup>
      </Marker>
    </MapContainer>
  );
}
```

### 2. Consumindo com next/dynamic
No seu arquivo de página (page.tsx), você **nunca** deve importar o componente acima diretamente. Use o next/dynamic para desabilitar o SSR.

```tsx
import dynamic from 'next/dynamic';

// A "Skill" fundamental: ssr: false
const MapWithNoSSR = dynamic(() => import('../components/Map'), {
  ssr: false,
  loading: () => <p>Carregando mapa...</p>,
});

export default function DeliveryPage() {
  return (
    <main>
      <h1>Rastreamento de Entrega</h1>
      <MapWithNoSSR />
    </main>
  );
}
```

## Diretrizes para a IA (Protocolo Leaflet/Next)
Sempre que a tarefa envolver Leaflet e Next.js, siga estas regras:
* **Isolamento de Componente:** O código do Leaflet deve residir em um arquivo separado marcado com 'use client'.
* **Importação Tardia:** O componente de mapa deve ser importado via next/dynamic.
* **SSR Disabled:** O objeto de configuração de importação deve obrigatoriamente conter `{ ssr: false }`.
* **CSS Global:** O arquivo `leaflet.css` deve ser importado dentro do componente cliente ou no `layout.tsx` para evitar que os tiles apareçam quebrados.
* **Fix de Ícones:** Lembre-se que o Next.js lida com assets de forma diferente; os caminhos dos ícones do Leaflet geralmente precisam ser redefinidos manualmente usando `L.Icon.Default.mergeOptions`.
