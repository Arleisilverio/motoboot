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
  const [helmetColor, setHelmetColor] = useState('#22C55E');

  const PRESET_COLORS = [
    { name: 'Esmeralda', value: '#22C55E' },
    { name: 'Ciano', value: '#06B6D4' },
    { name: 'Índigo', value: '#6366F1' },
    { name: 'Rosa', value: '#F43F5E' },
    { name: 'Âmbar', value: '#F59E0B' },
    { name: 'Violeta', value: '#8B5CF6' },
    { name: 'Gelo', value: '#CBD5E1' }
  ];

  useEffect(() => {
    if (profile) {
      setNameInput(profile.name || '');
      setWhatsappInput(profile.whatsapp || '');
      setHelmetColor(profile.helmet_color || '#22C55E');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    setSaveLoading(true);
    const supabase = getSupabaseClient();
    
    if (supabase) {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          name: nameInput, 
          whatsapp: whatsappInput,
          helmet_color: helmetColor 
        })
        .eq('id', profile.id);
        
      if (!error) {
        setIsEditing(false);
        router.refresh();
      } else {
        alert('Erro ao salvar os dados.');
      }
    }
    setSaveLoading(true);
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
    <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)', minHeight: '100vh', paddingBottom: '100px' }}>
      
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
            background: isAdmin ? 'linear-gradient(135deg, #FF6A00, #FFBB00)' : `linear-gradient(135deg, ${helmetColor}, #000)`, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            fontSize: '32px',
            boxShadow: `0 8px 16px ${isAdmin ? 'rgba(255, 106, 0, 0.3)' : 'rgba(0,0,0,0.3)'}`,
            border: '2px solid rgba(255,255,255,0.1)'
          }}>
            {isAdmin ? '👑' : '🛵'}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Seu Nome/Apelido</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="premium-input"
                placeholder="Ex: João da Bros"
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>WhatsApp</label>
              <input
                type="tel"
                value={whatsappInput}
                onChange={(e) => setWhatsappInput(e.target.value)}
                className="premium-input"
                placeholder="Ex: 11999999999"
              />
            </div>

            {!isAdmin && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Cor do Capacete no Mapa</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setHelmetColor(color.value)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: color.value,
                        border: helmetColor === color.value ? '3px solid white' : 'none',
                        boxShadow: helmetColor === color.value ? `0 0 10px ${color.value}` : 'none',
                        transition: 'all 0.2s'
                      }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '700' }}>WhatsApp</div>
              <div style={{ fontSize: '16px', color: profile.whatsapp ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {profile.whatsapp || 'Não cadastrado'}
              </div>
            </div>
            
            {!isAdmin && (
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '700' }}>Cor Ativa</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: helmetColor }}></div>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {PRESET_COLORS.find(c => c.value === helmetColor)?.name || 'Custom'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
