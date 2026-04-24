'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/providers/AuthProvider';
import { LogOut, User, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import styles from './UserHeaderBadge.module.css';

export function UserHeaderBadge() {
  const { user, profile, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) {
    return (
      <Link href="/login" className={styles.loginBtn}>
        <User size={16} />
        <span>Entrar</span>
      </Link>
    );
  }

  const displayName = profile?.name || user.email?.split('@')[0] || 'Motoboy';
  const avatarUrl = profile?.avatar_url;
  const isAdmin = profile?.role === 'admin';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className={styles.wrap} ref={menuRef}>
      {/* BADGE CLICÁVEL */}
      <button
        className={styles.badge}
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Menu do usuário"
      >
        {/* AVATAR */}
        <div className={`${styles.avatar} ${isAdmin ? styles.avatarAdmin : ''}`}>
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              width={34}
              height={34}
              className={styles.avatarImg}
            />
          ) : (
            <span className={styles.initials}>{initials}</span>
          )}
          {/* Ponto verde "online" */}
          <span className={styles.onlineDot} />
        </div>

        {/* NOME */}
        <div className={styles.nameWrap}>
          <span className={styles.name}>{displayName.split(' ')[0]}</span>
          {isAdmin && <span className={styles.adminPill}>ADM</span>}
        </div>

        <ChevronDown
          size={14}
          className={`${styles.chevron} ${menuOpen ? styles.chevronOpen : ''}`}
        />
      </button>

      {/* DROPDOWN MENU */}
      {menuOpen && (
        <div className={styles.dropdown}>
          {/* Info do usuário */}
          <div className={styles.dropdownHeader}>
            <div className={`${styles.dropdownAvatar} ${isAdmin ? styles.avatarAdmin : ''}`}>
              {avatarUrl ? (
                <Image src={avatarUrl} alt={displayName} width={44} height={44} className={styles.avatarImg} />
              ) : (
                <span className={styles.initials} style={{ fontSize: 16 }}>{initials}</span>
              )}
            </div>
            <div>
              <div className={styles.dropdownName}>{displayName}</div>
              <div className={styles.dropdownEmail}>{user.email}</div>
              {isAdmin && <span className={styles.adminPillLarge}>👑 Administrador</span>}
            </div>
          </div>

          <div className={styles.dropdownDivider} />

          {/* Perfil */}
          <Link href="/perfil" className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>
            <User size={15} />
            Meu Perfil &amp; Foto
          </Link>

          <div className={styles.dropdownDivider} />

          {/* Sair */}
          <button
            className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
            onClick={async () => {
              setMenuOpen(false);
              await signOut();
            }}
          >
            <LogOut size={15} />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
