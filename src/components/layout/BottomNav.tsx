'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/BottomNav.module.css';

export const BottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { id: 'nav-home', label: 'Home', icon: '🏠', path: '/' },
    { id: 'nav-tools', label: 'Ferramentas', icon: '🔧', path: '/ferramentas' },
    { id: 'nav-map', label: 'Mapa', icon: '🗺️', path: '#' }, // Placeholder link
    { id: 'nav-profile', label: 'Perfil', icon: '👤', path: '#' }, // Placeholder link
  ];

  return (
    <nav className={styles.bottomNav}>
      <div className={styles.navRow}>
        {navItems.slice(0, 2).map((item) => (
          <Link
            key={item.id}
            href={item.path}
            className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
            id={item.id}
          >
            <span className={styles.navItemIcon}>{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <button className={styles.navFab} id="nav-radio" aria-label="Rádio Online">
          📻
        </button>

        {navItems.slice(2).map((item) => (
          <Link
            key={item.id}
            href={item.path}
            className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
            id={item.id}
          >
            <span className={styles.navItemIcon}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};
