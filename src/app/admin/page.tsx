'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';

interface DashboardStats {
  totalMembers: number;
  totalServices: number;
  totalClients: number;
  activeAlerts: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    totalServices: 0,
    totalClients: 0,
    activeAlerts: 0,
  });
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      router.push('/login');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      router.push('/perfil');
      return;
    }

    setUserRole(profile.role);
    loadStats();
  };

  const loadStats = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const [membersRes, servicesRes, clientsRes] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('services').select('id', { count: 'exact', head: true }),
      supabase.from('clients').select('id', { count: 'exact', head: true }),
    ]);

    setStats({
      totalMembers: membersRes.count || 0,
      totalServices: servicesRes.count || 0,
      totalClients: clientsRes.count || 0,
      activeAlerts: 0,
    });
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0D0D0D', color: '#fff' }}>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, padding: '24px', backgroundColor: '#0D0D0D', color: '#fff' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>
          Painel Admin
        </h1>
        <button 
          onClick={() => router.push('/perfil')}
          style={{ background: 'transparent', color: '#a1a1aa', border: 'none', fontSize: '14px', cursor: 'pointer' }}
        >
          ← Voltar ao Perfil
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: '#1c1c1e', padding: '20px', borderRadius: '12px' }}>
          <p style={{ color: '#a1a1aa', fontSize: '14px' }}>Membros</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalMembers}</p>
        </div>
        <div style={{ background: '#1c1c1e', padding: '20px', borderRadius: '12px' }}>
          <p style={{ color: '#a1a1aa', fontSize: '14px' }}>Serviços</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalServices}</p>
        </div>
        <div style={{ background: '#1c1c1e', padding: '20px', borderRadius: '12px' }}>
          <p style={{ color: '#a1a1aa', fontSize: '14px' }}>Clientes</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalClients}</p>
        </div>
        <div style={{ background: '#1c1c1e', padding: '20px', borderRadius: '12px' }}>
          <p style={{ color: '#a1a1aa', fontSize: '14px' }}>Alertas Ativos</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.activeAlerts}</p>
        </div>
      </div>

      <div style={{ background: '#1c1c1e', padding: '20px', borderRadius: '12px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Gerenciar Acesso</h2>
        <p style={{ color: '#a1a1aa', fontSize: '14px' }}>
          Configure permissões de acesso no banco de dados (tabela profiles, campo role).
        </p>
      </div>
    </div>
  );
}