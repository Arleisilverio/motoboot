'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/ferramentas.module.css';
import { 
  Calculator, 
  Radio, 
  AlertTriangle, 
  BookOpen, 
  ChevronRight, 
  AlertOctagon 
} from 'lucide-react';

import { useRadio } from '@/providers/RadioProvider';

export const FerramentasMenu = () => {
  const router = useRouter();
  const { isPlaying, isBuffering, toggleRadio } = useRadio();

  const handleToolClick = (toolName: string) => {
    console.log(`[Motoboot] Abrindo ferramenta: ${toolName}`);
    alert(`A ferramenta "${toolName}" será liberada em breve! Estamos preparando os melhores recursos para você.`);
  };

  const handlePanicClick = () => {
    const confirmPanic = confirm('🚨 ALERTA DE EMERGÊNCIA\n\nDeseja enviar sua localização e um pedido de ajuda para a comunidade Motoboot agora?');
    if (confirmPanic) {
      alert('Pedido de emergência enviado! Mantenha a calma, a comunidade foi notificada.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Ferramentas do Canal</h2>
      </div>

      <div className={styles.toolsGrid}>
        <button 
          className={styles.toolCard} 
          id="tool-calculator"
          onClick={() => router.push('/ferramentas/calculadora')}
        >
          <div className={`${styles.toolIconWrap} ${styles.toolOrange}`}>
            <Calculator size={24} color="var(--accent)" />
          </div>
          <div className={styles.toolBody}>
            <span className={styles.toolName}>Calculadora de KM</span>
            <span className={styles.toolDesc}>Calcule distância e custos</span>
          </div>
          <ChevronRight size={20} className={styles.toolArrow} />
        </button>

        <button 
          className={`${styles.toolCard} ${isPlaying ? styles.toolActive : ''}`} 
          id="tool-radio"
          onClick={toggleRadio}
        >
          <div className={`${styles.toolIconWrap} ${isPlaying ? styles.toolPlaying : styles.toolGreen}`}>
            {isBuffering ? <span className={styles.bufferingSpan}>⌛</span> : <Radio size={24} color={isPlaying ? '#fff' : 'var(--success)'} />}
          </div>
          <div className={styles.toolBody}>
            <span className={styles.toolName}>Rádio Online</span>
            <span className={styles.toolDesc}>{isPlaying ? 'Tocando agora...' : 'Ouça enquanto pilota'}</span>
          </div>
          {isPlaying && <div className={styles.playingIndicator}><span></span><span></span><span></span></div>}
          {!isPlaying && <ChevronRight size={20} className={styles.toolArrow} />}
        </button>

        <button 
          className={styles.toolCard} 
          id="tool-alerts"
          onClick={() => handleToolClick('Alertas da Região')}
        >
          <div className={`${styles.toolIconWrap} ${styles.toolYellow}`}>
            <AlertTriangle size={24} color="var(--accent-2)" />
          </div>
          <div className={styles.toolBody}>
            <span className={styles.toolName}>Alertas da Região</span>
            <span className={styles.toolDesc}>Blitz, trânsito e perigos</span>
          </div>
          <ChevronRight size={20} className={styles.toolArrow} />
        </button>

        <button 
          className={styles.toolCard} 
          id="tool-tips"
          onClick={() => handleToolClick('Dicas e Informações')}
        >
          <div className={`${styles.toolIconWrap} ${styles.toolBlue}`}>
            <BookOpen size={24} color="var(--info)" />
          </div>
          <div className={styles.toolBody}>
            <span className={styles.toolName}>Dicas e Informações</span>
            <span className={styles.toolDesc}>Segurança, manutenção e mais</span>
          </div>
          <ChevronRight size={20} className={styles.toolArrow} />
        </button>
      </div>

      {/* Botão de Emergência */}
      <div className={styles.panicSection}>
        <button 
          className={styles.panicBtn} 
          id="btn-panic"
          onClick={handlePanicClick}
        >
          <AlertOctagon size={22} className={styles.panicIcon} />
          Botão de Emergência
        </button>
        <p className={styles.panicHint}>
          Toque para enviar alerta de emergência à comunidade
        </p>
      </div>
    </div>
  );
};

