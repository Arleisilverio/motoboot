'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, Camera, Trash2, ChevronRight, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import styles from './perfil.module.css';

const PRESET_COLORS = [
  { name: 'Esmeralda', value: '#22C55E' },
  { name: 'Ciano',     value: '#06B6D4' },
  { name: 'Índigo',    value: '#6366F1' },
  { name: 'Rosa',      value: '#F43F5E' },
  { name: 'Âmbar',     value: '#F59E0B' },
  { name: 'Violeta',   value: '#8B5CF6' },
  { name: 'Branco Gelo', value: '#CBD5E1' },
  { name: 'Laranja',   value: '#F97316' },
];

type ToastType = 'success' | 'error';

export default function PerfilPage() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();

  // ── form state ─────────────────────────────────────────────
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [nameInput, setNameInput]  = useState('');
  const [helmetColor, setHelmetColor] = useState('#22C55E');

  // ── avatar state ───────────────────────────────────────────
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── toast ──────────────────────────────────────────────────
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);
  const showToast = useCallback((msg: string, type: ToastType = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── sync form with profile ─────────────────────────────────
  useEffect(() => {
    if (profile) {
      setNameInput(profile.name || '');
      setHelmetColor((profile as any).helmet_color || '#22C55E');
      setAvatarPreview((profile as any).avatar_url || null);
    }
  }, [profile]);

  // ── SAVE profile (name + helmet_color only) ────────────────
  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ name: nameInput.trim(), helmet_color: helmetColor })
      .eq('id', profile.id);

    setSaving(false);
    if (error) {
      showToast('Erro ao salvar. Tente novamente.', 'error');
    } else {
      setIsEditing(false);
      showToast('Perfil atualizado com sucesso!');
      router.refresh();
    }
  };

  // ── UPLOAD avatar ──────────────────────────────────────────
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Valida tamanho (max 3MB) e tipo
    if (file.size > 3 * 1024 * 1024) {
      showToast('Imagem muito grande. Máx 3MB.', 'error');
      return;
    }
    if (!file.type.startsWith('image/')) {
      showToast('Selecione uma imagem válida.', 'error');
      return;
    }

    setUploadingAvatar(true);

    // Pré-visualização local imediata
    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);

    // Upload para storage: avatars/{userId}/avatar.{ext}
    const ext = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      showToast('Erro no upload. Tente novamente.', 'error');
      setAvatarPreview((profile as any)?.avatar_url || null);
      setUploadingAvatar(false);
      return;
    }

    // Gera URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Salva URL no perfil
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    setUploadingAvatar(false);
    if (updateError) {
      showToast('Foto enviada, mas erro ao salvar URL.', 'error');
    } else {
      setAvatarPreview(publicUrl);
      showToast('Foto de perfil atualizada!');
      router.refresh();
    }
  };

  // ── DELETE avatar ──────────────────────────────────────────
  const handleDeleteAvatar = async () => {
    if (!user) return;
    setUploadingAvatar(true);

    // Remove arquivos do storage (tenta .jpg, .jpeg, .png, .webp)
    const exts = ['jpg', 'jpeg', 'png', 'webp'];
    for (const ext of exts) {
      await supabase.storage.from('avatars').remove([`${user.id}/avatar.${ext}`]);
    }

    // Limpa URL no perfil
    await supabase.from('profiles').update({ avatar_url: null }).eq('id', user.id);

    setAvatarPreview(null);
    setUploadingAvatar(false);
    showToast('Foto removida.');
    router.refresh();
  };

  // ── LOADING ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingWrap}>
          <div className={styles.spinner} />
        </div>
      </div>
    );
  }

  // ── NOT LOGGED IN ──────────────────────────────────────────
  if (!user || !profile) {
    return (
      <div className={styles.page}>
        <div className={styles.gateWrap}>
          <span className={styles.gateIcon}>🏍️</span>
          <p className={styles.gateTitle}>Faça login para ver seu perfil</p>
          <p className={styles.gateSub}>Cadastre-se ou entre na sua conta para acessar todas as funcionalidades da comunidade Motoboot.</p>
          <Link href="/login" className={styles.gateBtn}>Entrar / Cadastrar</Link>
        </div>
      </div>
    );
  }

  const isAdmin = profile.role === 'admin';
  const displayName = profile.name || 'Motoboy Parceiro';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className={styles.page}>
      {/* ── HERO ───────────────────────────────────────────── */}
      <div className={styles.hero}>
        <div className={styles.heroHeader}>
          <h1 className={styles.heroTitle}>Meu Perfil</h1>
          <button className={styles.logoutBtn} onClick={signOut}>
            <LogOut size={14} />
            Sair
          </button>
        </div>

        {/* ── AVATAR ─────────────────────────────────────── */}
        <div className={styles.avatarSection}>
          <div className={styles.avatarRing}>
            <div className={`${styles.avatarCircle} ${isAdmin ? styles.avatarCircleAdmin : ''}`}>
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt={displayName}
                  width={100}
                  height={100}
                  className={styles.avatarImg}
                  unoptimized
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            {uploadingAvatar && <div className={styles.avatarUploading} />}
            {/* Botão câmera */}
            <button
              className={styles.avatarEditBtn}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              title="Alterar foto"
            >
              <Camera size={14} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={handleAvatarChange}
            />
          </div>

          {/* Nome + role */}
          <div className={styles.nameRow}>
            <div className={styles.userName}>{displayName}</div>
            <div className={`${styles.roleBadge} ${isAdmin ? styles.roleBadgeAdmin : styles.roleBadgeMember}`}>
              {isAdmin ? '👑 Administrador' : '🛵 Membro'}
            </div>
          </div>

          {/* Botões de avatar */}
          <div className={styles.avatarActions}>
            <button
              className={`${styles.avatarBtn} ${styles.avatarBtnPrimary}`}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
            >
              <Camera size={13} />
              {uploadingAvatar ? 'Enviando…' : 'Alterar foto'}
            </button>
            {avatarPreview && (
              <button
                className={`${styles.avatarBtn} ${styles.avatarBtnDanger}`}
                onClick={handleDeleteAvatar}
                disabled={uploadingAvatar}
              >
                <Trash2 size={13} />
                Remover
              </button>
            )}
          </div>
          <p className={styles.avatarHint}>Foto de perfil ou da sua moto · Máx 3MB</p>
        </div>
      </div>

      {/* ── CONTEÚDO ───────────────────────────────────────── */}
      <div className={styles.content}>

        {/* Admin shortcut */}
        {isAdmin && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.adminCard}
            onClick={() => router.push('/admin')}
          >
            <span className={styles.adminCardIcon}>📊</span>
            <div className={styles.adminCardText}>
              <div className={styles.adminCardTitle}>Painel Administrativo</div>
              <div className={styles.adminCardSub}>Gerenciar membros, alertas e configurações</div>
            </div>
            <ChevronRight size={18} className={styles.adminCardArrow} />
          </motion.button>
        )}

        {/* ── DADOS PESSOAIS ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className={styles.card}
        >
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Dados Pessoais</span>
            {!isEditing && (
              <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
                EDITAR
              </button>
            )}
          </div>

          {isEditing ? (
            <div className={styles.fieldGroup}>
              {/* Nome (editável) */}
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Nome / Apelido</label>
                <input
                  type="text"
                  className={styles.fieldInput}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Ex: João da Bros"
                  maxLength={40}
                />
              </div>

              {/* WhatsApp (BLOQUEADO — read-only) */}
              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  WhatsApp
                  <Lock size={11} className={styles.lockIcon} />
                </label>
                <input
                  type="tel"
                  className={`${styles.fieldInput} ${styles.fieldInputLocked}`}
                  value={profile.whatsapp || ''}
                  readOnly
                  tabIndex={-1}
                />
                <span className={styles.lockedNote}>
                  <Lock size={10} />
                  Número não pode ser alterado por segurança
                </span>
              </div>

              {/* Cor do capacete (só motoboys comuns) */}
              {!isAdmin && (
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Cor do Capacete no Mapa</label>
                  <div className={styles.helmetSection}>
                    <div className={styles.helmetPreview}>
                      <div className={styles.helmetDot} style={{ background: helmetColor, boxShadow: `0 0 8px ${helmetColor}` }} />
                      <span className={styles.helmetName}>
                        {PRESET_COLORS.find(c => c.value === helmetColor)?.name ?? 'Personalizado'}
                      </span>
                    </div>
                    <div className={styles.colorPalette}>
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color.value}
                          className={`${styles.colorSwatch} ${helmetColor === color.value ? styles.colorSwatchActive : ''}`}
                          style={{
                            backgroundColor: color.value,
                            boxShadow: helmetColor === color.value ? `0 0 12px ${color.value}` : 'none',
                          }}
                          onClick={() => setHelmetColor(color.value)}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Ações */}
              <div className={styles.actionRow}>
                <button className={styles.cancelBtn} onClick={() => { setIsEditing(false); setNameInput(profile.name || ''); }}>
                  Cancelar
                </button>
                <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                  {saving ? 'Salvando…' : 'Salvar Perfil'}
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.fieldGroup}>
              {/* Nome */}
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Nome / Apelido</span>
                <span className={`${styles.fieldValue} ${!profile.name ? styles.fieldValueMuted : ''}`}>
                  {profile.name || 'Não definido'}
                </span>
              </div>

              {/* WhatsApp */}
              <div className={styles.field}>
                <span className={styles.fieldLabel}>
                  WhatsApp
                  <Lock size={11} className={styles.lockIcon} />
                </span>
                <span className={`${styles.fieldValue} ${!profile.whatsapp ? styles.fieldValueMuted : ''}`}>
                  {profile.whatsapp || 'Não cadastrado'}
                </span>
              </div>

              {/* E-mail (somente leitura) */}
              <div className={styles.field}>
                <span className={styles.fieldLabel}>
                  E-mail
                  <Lock size={11} className={styles.lockIcon} />
                </span>
                <span className={styles.fieldValue}>{user.email}</span>
              </div>

              {/* Cor do capacete (view only) */}
              {!isAdmin && (
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Cor no Mapa</span>
                  <div className={styles.helmetPreview}>
                    <div className={styles.helmetDot} style={{ background: helmetColor, boxShadow: `0 0 8px ${helmetColor}` }} />
                    <span className={styles.helmetName}>
                      {PRESET_COLORS.find(c => c.value === helmetColor)?.name ?? helmetColor}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* ── CONTA ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={styles.card}
        >
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Conta</span>
          </div>
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Função</span>
              <span className={styles.fieldValue}>{isAdmin ? 'Administrador Motoboot' : 'Membro da Comunidade'}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Membro desde</span>
              <span className={styles.fieldValue}>
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
                  : '—'}
              </span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* ── TOAST ──────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={15} style={{ display: 'inline', marginRight: 6 }} /> : <AlertCircle size={15} style={{ display: 'inline', marginRight: 6 }} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
