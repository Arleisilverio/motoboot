'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      setError('Erro de conexão interno (Supabase não configurado)');
      setLoading(false);
      return;
    }

    try {
      if (isRegistering) {
        if (!name || !whatsapp) {
          setError('Preencha seu Nome e WhatsApp para cadastro.');
          setLoading(false);
          return;
        }

        const { data, error: signupError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signupError) throw signupError;

        // Ao cadastrar, a trigger do Supabase criará a linha em `profiles`.
        // Nós então faremos um update com o name e whatsapp nela.
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ name: name, whatsapp: whatsapp })
            .eq('id', data.user.id);
            
          if (profileError) console.error('Erro ao salvar info no perfil:', profileError);
        }

        router.push('/perfil');
      } else {
        const { error: signinError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signinError) throw signinError;

        router.push('/perfil');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', backgroundColor: '#0D0D0D' }}>
      
      <header style={{ marginBottom: '40px', marginTop: '20px', textAlign: 'center' }}>
        <Image
          src="https://i.supaimg.com/ab10c538-a9f0-4a7a-9c0d-5a65ded30e00/98114ba7-a562-42fe-b43a-a5b083b9abd2.png"
          alt="Motoboot Logo"
          width={140}
          height={44}
          style={{ objectFit: 'contain', margin: '0 auto' }}
          priority
        />
      </header>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#1c1c1e', padding: '24px', borderRadius: '16px' }}>
        <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '8px' }}>
          {isRegistering ? 'Criar Conta' : 'Acesse sua Conta'}
        </h2>

        {error && (
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '8px', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {isRegistering && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#a1a1aa', fontSize: '14px' }}>Como quer ser chamado?</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu Nome/Apelido"
                style={{ padding: '14px', borderRadius: '8px', border: 'none', background: '#2c2c2e', color: '#fff', fontSize: '16px' }}
                required={isRegistering}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#a1a1aa', fontSize: '14px' }}>Número do WhatsApp</label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(11) 99999-9999"
                style={{ padding: '14px', borderRadius: '8px', border: 'none', background: '#2c2c2e', color: '#fff', fontSize: '16px' }}
                required={isRegistering}
              />
            </div>
          </>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ color: '#a1a1aa', fontSize: '14px' }}>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            style={{ padding: '14px', borderRadius: '8px', border: 'none', background: '#2c2c2e', color: '#fff', fontSize: '16px' }}
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ color: '#a1a1aa', fontSize: '14px' }}>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ padding: '14px', borderRadius: '8px', border: 'none', background: '#2c2c2e', color: '#fff', fontSize: '16px' }}
            required
            minLength={6}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            background: 'var(--accent, #FF6A00)', 
            color: '#fff', 
            padding: '16px', 
            borderRadius: '8px', 
            border: 'none', 
            fontWeight: 'bold', 
            fontSize: '16px',
            marginTop: '8px',
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Aguarde...' : (isRegistering ? 'Cadastrar' : 'Entrar na Comunidade')}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError('');
          }}
          disabled={loading}
          style={{ background: 'transparent', color: '#FF6A00', border: 'none', fontSize: '14px', marginTop: '8px', cursor: 'pointer' }}
        >
          {isRegistering ? 'Já tenho uma conta. Fazer Login.' : 'Ainda não é membro? Cadastre-se.'}
        </button>
      </form>
    </div>
  );
}
