'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/BottomNav.module.css';

import { useAuth } from '@/providers/AuthProvider';

export const BottomNav = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { id: 'nav-home', label: 'Home', icon: '🏠', path: '/' },
    { id: 'nav-tools', label: 'Ferramentas', icon: '🔧', path: '/ferramentas' },
    { id: 'nav-map', label: 'Mapa', icon: '🗺️', path: '#' },
    { 
      id: 'nav-profile', 
      label: user ? 'Perfil' : 'Entrar', 
      icon: user ? '👤' : '🔑', 
      path: '/perfil' // Middleware redirects to /login if needed
    },
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
