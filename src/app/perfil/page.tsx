'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import Image from 'next/image';

type Profile = {
  id: string;
  email: string;
  name: string | null;
  whatsapp: string | null;
  role: string | null;
};

export default function PerfilPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  
  const [nameInput, setNameInput] = useState('');
  const [whatsappInput, setWhatsappInput] = useState('');

  useEffect(() => {
    async function loadSession() {
      const supabase = getSupabaseClient();
      if (!supabase) return setLoading(false);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.replace('/login');
        return;
      }

      // Fetch profile from db
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (data) {
        setProfile(data as Profile);
        setNameInput(data.name || '');
        setWhatsappInput(data.whatsapp || '');
      } else if (error) {
        console.error('Error fetching profile:', error);
      }
      
      setLoading(false);
    }
    
    loadSession();
  }, [router]);

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
        setProfile({ ...profile, name: nameInput, whatsapp: whatsappInput });
        setIsEditing(false);
      } else {
        alert('Erro ao salvar os dados.');
      }
    }
    setSaveLoading(false);
  };

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: '#FF6A00' }}>Carregando Perfil...</div>
      </div>
    );
  }

  if (!profile) return null; // vai redirecionar pro login via useEffect

  const isAdmin = profile.role === 'admin';

  return (
    <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Meu Perfil</h1>
        {isAdmin && (
          <button 
            onClick={() => router.push('/admin')}
            style={{ background: 'transparent', color: '#FF6A00', border: '1px solid #FF6A00', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Painel Admin
          </button>
        )}
        <button onClick={handleLogout} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
          Sair
        </button>
      </header>

      <div style={{ background: '#1c1c1e', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '32px', background: isAdmin ? '#FF6A00' : '#3f3f46', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px' }}>
            {isAdmin ? '👑' : '👤'}
          </div>
          <div>
            <h2 style={{ fontSize: '20px', margin: 0, fontWeight: 'bold', color: isAdmin ? '#FF6A00' : '#fff' }}>
              {profile.name || 'Sem Nome'}
            </h2>
            <div style={{ fontSize: '14px', color: '#a1a1aa' }}>
              {profile.email}
            </div>
            {isAdmin && (
              <span style={{ display: 'inline-block', background: 'rgba(255, 106, 0, 0.2)', color: '#FF6A00', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', marginTop: '6px' }}>
                ADMINISTRADOR
              </span>
            )}
          </div>
        </div>

        <hr style={{ border: '0', height: '1px', background: '#2c2c2e', margin: '8px 0' }} />

        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#a1a1aa', fontSize: '14px' }}>Como quer ser chamado?</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                style={{ padding: '12px', borderRadius: '8px', border: 'none', background: '#2c2c2e', color: '#fff', fontSize: '16px' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#a1a1aa', fontSize: '14px' }}>Número do WhatsApp</label>
              <input
                type="tel"
                value={whatsappInput}
                onChange={(e) => setWhatsappInput(e.target.value)}
                style={{ padding: '12px', borderRadius: '8px', border: 'none', background: '#2c2c2e', color: '#fff', fontSize: '16px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button 
                onClick={() => setIsEditing(false)}
                style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', fontSize: '16px', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                disabled={saveLoading}
                style={{ flex: 1, padding: '12px', background: 'var(--accent, #FF6A00)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: saveLoading ? 'wait' : 'pointer' }}
              >
                {saveLoading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ color: '#a1a1aa', fontSize: '14px', marginBottom: '4px' }}>Telefone (WhatsApp)</div>
              <div style={{ fontSize: '16px', color: profile.whatsapp ? '#fff' : '#52525b' }}>
                {profile.whatsapp || 'Não informado'}
              </div>
            </div>
            
            <button 
              onClick={() => setIsEditing(true)}
              style={{ padding: '12px', background: '#2c2c2e', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}
            >
              Editar Dados
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
