import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FerramentasMenu } from '@/components/features/FerramentasMenu';
import styles from '@/styles/home.module.css';

export default function FerramentasPage() {
  return (
    <div className={styles.page}>
      {/* ── Header fixo ── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerRight} style={{ gap: '12px' }}>
            <Link href="/" className={styles.iconBtn} aria-label="Voltar">
              ←
            </Link>
            <div className={styles.logoWrap}>
              <Image
                src="https://i.supaimg.com/ab10c538-a9f0-4a7a-9c0d-5a65ded30e00/98114ba7-a562-42fe-b43a-a5b083b9abd2.png"
                alt="Motoboot Logo"
                width={110}
                height={34}
                className={styles.logoImage}
                priority
              />
            </div>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.iconBtn} aria-label="Notificações">
              🔔
              <span className={styles.notifBadge} />
            </button>
          </div>
        </div>
      </header>

      <main className={styles.pageContent}>
        <FerramentasMenu />
      </main>
    </div>
  );
}
