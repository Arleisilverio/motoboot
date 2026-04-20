'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';

type RadioContextType = {
  isPlaying: boolean;
  isBuffering: boolean;
  toggleRadio: () => void;
  playRadio: () => void;
  pauseRadio: () => void;
};

const RadioContext = createContext<RadioContextType | undefined>(undefined);

const RADIO_URL = 'https://play.motoboot.com.br/stream';

export const RadioProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Inicializa o elemento de áudio apenas no cliente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio();
      audio.src = RADIO_URL;
      audio.preload = 'none'; // Não carrega até o play para economizar dados
      
      audio.onwaiting = () => setIsBuffering(true);
      audio.onplaying = () => {
        setIsBuffering(false);
        setIsPlaying(true);
      };
      audio.onpause = () => setIsPlaying(false);
      audio.onerror = () => {
        console.error('Erro no stream da rádio');
        setIsPlaying(false);
        setIsBuffering(false);
      };

      audioRef.current = audio;

      // Configura Media Session API se disponível
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: 'Rádio Motoboot',
          artist: 'Ao Vivo',
          album: 'Canal Motoboot',
          artwork: [
            { src: 'https://i.supaimg.com/ab10c538-a9f0-4a7a-9c0d-5a65ded30e00/98114ba7-a562-42fe-b43a-a5b083b9abd2.png', sizes: '512x512', type: 'image/png' }
          ]
        });

        navigator.mediaSession.setActionHandler('play', () => playRadio());
        navigator.mediaSession.setActionHandler('pause', () => pauseRadio());
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const playRadio = () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (audioRef.current) {
      setIsBuffering(true);
      audioRef.current.play().catch(err => {
        console.error('Falha ao tocar rádio:', err);
        setIsBuffering(false);
      });
    }
  };

  const pauseRadio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      // Reseta o src para rádio ao vivo para não acumular delay
      audioRef.current.src = '';
      audioRef.current.src = RADIO_URL;
      setIsPlaying(false);
    }
  };

  const toggleRadio = () => {
    if (isPlaying) {
      pauseRadio();
    } else {
      playRadio();
    }
  };

  return (
    <RadioContext.Provider value={{ isPlaying, isBuffering, toggleRadio, playRadio, pauseRadio }}>
      {children}
    </RadioContext.Provider>
  );
};

export const useRadio = () => {
  const context = useContext(RadioContext);
  if (context === undefined) {
    throw new Error('useRadio must be used within a RadioProvider');
  }
  return context;
};
