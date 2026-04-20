'use client';

import Image from "next/image";
import styles from "@/styles/home.module.css";
import { CarouselWrapper } from "./CarouselWrapper";
import { MapPin, Signal, LogIn, LogOut } from "lucide-react";
import LiveMapSection from "@/components/LiveMapSection";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";

export default function Home() {
  const { user, profile, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <div className={styles.page}>
      {/* ── Header com Logo ── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logoWrap}>
            <Image
              src="https://i.supaimg.com/ab10c538-a9f0-4a7a-9c0d-5a65ded30e00/98114ba7-a562-42fe-b43a-a5b083b9abd2.png"
              alt="Motoboot Logo"
              width={140}
              height={44}
              className={styles.logoImage}
              priority
            />
          </div>
          <div className={styles.headerRight}>
            {!user ? (
              <Link href="/login" className={styles.loginBtnHeader}>
                <LogIn size={18} />
                <span>Entrar</span>
              </Link>
            ) : (
              <>
                <button className={styles.iconBtn} id="btn-notifications" aria-label="Notificações">
                  🔔
                  <span className={styles.notifBadge} />
                </button>
                <button 
                  onClick={handleLogout} 
                  className={styles.logoutBtnHeader}
                  title="Sair"
                >
                  <LogOut size={18} />
                  <span>Sair</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>


      {/* ── Main Content ── */}
      <main className={styles.pageContent}>
        {/* Carrossel de Imagens */}
        <CarouselWrapper />

        {/* Info do Canal Motoboot */}
        <section className={styles.channelInfo}>
          <div className={styles.channelHeader}>
            <div className={styles.channelAvatar}>
              <Image
                src="https://i.supaimg.com/ab10c538-a9f0-4a7a-9c0d-5a65ded30e00/98114ba7-a562-42fe-b43a-a5b083b9abd2.png"
                alt="Motoboot"
                width={48}
                height={48}
                className={styles.channelAvatarImg}
              />
            </div>
            <div className={styles.channelText}>
              <h1 className={styles.channelName}>Canal Motoboot</h1>
              <p className={styles.channelTagline}>Informação, segurança e união na rua</p>
            </div>
          </div>

          <p className={styles.channelDescription}>
            O canal que conecta motoboys de todo o Brasil. Ferramentas úteis,
            alertas em tempo real, localização e muito mais. Junte-se à comunidade!
          </p>

          {/* Canal Stats */}
          <div className={styles.channelStats}>
            <div className={styles.channelStat}>
              <span className={styles.channelStatValue}>12.4K</span>
              <span className={styles.channelStatLabel}>Membros</span>
            </div>
            <div className={styles.channelStatDivider} />
            <div className={styles.channelStat}>
              <span className={styles.channelStatValue}>847</span>
              <span className={styles.channelStatLabel}>Online agora</span>
            </div>
            <div className={styles.channelStatDivider} />
            <div className={styles.channelStat}>
              <span className={styles.channelStatValue}>45K</span>
              <span className={styles.channelStatLabel}>Mensagens</span>
            </div>
          </div>
        </section>

        {/* Botões de Ação Rápida */}
        <div className={styles.whatsappSection}>
          <a href="https://chat.whatsapp.com/C176dMLf4F132CRimGFnoQ?mode=hqctcla" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <button className={styles.whatsappBtn} id="btn-whatsapp-channel">
              <span className={styles.whatsappIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </span>
              Entrar no Grupo do WhatsApp
            </button>
          </a>
          <button className={styles.groupBtn} id="btn-app-group">
            <span className={styles.groupIcon}>👥</span>
            Grupo da Comunidade
          </button>
        </div>

        {/* Mapa — localização em tempo real */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Localização em Tempo Real</h2>
            <div className={styles.liveBadge}>
              <span className={styles.liveDot} />
              LIVE
            </div>
          </div>
          <p className={styles.mapDescription}>
            Veja onde o Motoboot está e encontre motoboys próximos.
          </p>
        </section>

        <LiveMapSection styles={styles} />
      </main>
    </div>
  );
}

