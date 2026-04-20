'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { getSupabaseClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';

export default function PerfilPage() {
  const router = useRouter();
  const { profile, loading, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  
  const [nameInput, setNameInput] = useState('');
  const [whatsappInput, setWhatsappInput] = useState('');

  useEffect(() => {
    if (profile) {
      setNameInput(profile.name || '');
      setWhatsappInput(profile.whatsapp || '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    setSaveLoading(true);
    const supabase = getSupabaseClient();
    
    if (supabase) {
      const { error } = await supabase
        .from('profiles')
        .update({ name: nameInput, whatsapp: whatsappInput })
        .eq('id', profile.id);
        
      if (!error) {
        setIsEditing(false);
        router.refresh();
      } else {
        alert('Erro ao salvar os dados.');
      }
    }
    setSaveLoading(true); // Manter true um pouco para feeling de ação
    setTimeout(() => setSaveLoading(false), 500);
  };

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-base)' }}>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          style={{ width: '40px', height: '40px', border: '4px solid var(--accent-muted)', borderTopColor: 'var(--accent)', borderRadius: '50%' }}
        />
      </div>
    );
  }

  if (!profile) return null;

  const isAdmin = profile.role === 'admin';

  return (
    <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-0.5px' }}>Perfil</h1>
        <button 
          onClick={() => signOut()} 
          style={{ color: 'var(--error)', fontSize: '14px', fontWeight: '700', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}
        >
          SAIR
        </button>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ padding: '24px', marginBottom: '24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '24px', 
            background: 'var(--accent-gradient)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            fontSize: '32px',
            boxShadow: 'var(--shadow-accent)'
          }}>
            {isAdmin ? '👑' : '👤'}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '4px' }}>
              {profile.name || 'Motoboy Parceiro'}
            </h2>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              padding: '4px 12px', 
              background: isAdmin ? 'var(--accent-muted)' : 'rgba(255,255,255,0.1)', 
              color: isAdmin ? 'var(--accent)' : 'var(--text-secondary)', 
              borderRadius: '20px', 
              fontSize: '12px', 
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {isAdmin ? 'Administrador' : 'Membro'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          <label style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px' }}>E-mail de acesso</label>
          <div style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>{profile.id.slice(0, 8)}... (Oculto por segurança)</div>
        </div>

        {isAdmin && (
          <button 
            onClick={() => router.push('/admin')}
            className="premium-button"
            style={{ marginBottom: '16px', background: 'var(--bg-elevated)', border: '1px solid var(--accent)', color: 'var(--accent)' }}
          >
            📊 Acessar Painel Admin
          </button>
        )}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card"
        style={{ padding: '24px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Dados Pessoais</h3>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '14px' }}>EDITAR</button>
          )}
        </div>

        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Seu Nome/Apelido</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="premium-input"
                placeholder="Ex: João da Bros"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>WhatsApp</label>
              <input
                type="tel"
                value={whatsappInput}
                onChange={(e) => setWhatsappInput(e.target.value)}
                className="premium-input"
                placeholder="Ex: 11999999999"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button 
                onClick={() => setIsEditing(false)}
                style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '15px' }}
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                disabled={saveLoading}
                className="premium-button"
                style={{ flex: 1 }}
              >
                {saveLoading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase' }}>WhatsApp</div>
              <div style={{ fontSize: '16px', color: profile.whatsapp ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {profile.whatsapp || 'Não cadastrado'}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
