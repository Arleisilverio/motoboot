'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const supabase = getSupabaseClient();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isRegistering) {
        if (!name || !whatsapp) {
          throw new Error('Preencha seu Nome e WhatsApp para cadastro.');
        }

        const { data, error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { 
              name, 
              whatsapp 
            }
          }
        });

        if (signupError) throw signupError;

        // Se data.session for null, significa que confirmação de e-mail é necessária
        if (!data.session) {
          setMessage('Cadastro realizado! Por favor, verifique seu e-mail para confirmar a conta.');
          setLoading(false);
          return;
        }
      } else {
        const { error: signinError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signinError) throw signinError;
      }
      router.push('/perfil');
    } catch (err: any) {
      setError(err.message || 'Erro na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!supabase) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(circle at top, #1a1a1a 0%, #0d0d0d 100%)',
      minHeight: '100dvh'
    }}>
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: '40px', textAlign: 'center' }}
      >
        <Image
          src="https://i.supaimg.com/ab10c538-a9f0-4a7a-9c0d-5a65ded30e00/98114ba7-a562-42fe-b43a-a5b083b9abd2.png"
          alt="Motoboot Logo"
          width={160}
          height={50}
          style={{ objectFit: 'contain' }}
          priority
        />
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px' }}>A maior comunidade de motoboys</p>
      </motion.div>

      <motion.div 
        className="glass-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ width: '100%', padding: '32px' }}
      >
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px', textAlign: 'center' }}>
          {isRegistering ? 'CRIAR CONTA' : 'BEM-VINDO'}
        </h2>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{ 
              padding: '12px', 
              background: 'rgba(239, 68, 68, 0.1)', 
              color: 'var(--error)', 
              borderRadius: '8px', 
              fontSize: '13px', 
              textAlign: 'center',
              marginBottom: '20px',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}
          >
            {error}
          </motion.div>
        )}
        {message && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{ 
              padding: '12px', 
              background: 'rgba(34, 197, 94, 0.1)', 
              color: '#22c55e', 
              borderRadius: '8px', 
              fontSize: '13px', 
              textAlign: 'center',
              marginBottom: '20px',
              border: '1px solid rgba(34, 197, 94, 0.2)'
            }}
          >
            {message}
          </motion.div>
        )}
        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="google-button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Continuar com Google
        </button>

        <div className="divider">Ou use seu e-mail</div>

        <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AnimatePresence mode="wait">
            {isRegistering && (
              <motion.div
                key="register-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}
              >
                <input
                  type="text"
                  placeholder="Seu Nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="premium-input"
                  required={isRegistering}
                />
                <input
                  type="tel"
                  placeholder="Seu WhatsApp (Ex: 11999999999)"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="premium-input"
                  required={isRegistering}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="premium-input"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="premium-input"
            required
            minLength={6}
          />

          <button 
            type="submit" 
            disabled={loading}
            className="premium-button"
          >
            {loading ? 'Processando...' : (isRegistering ? 'Criar minha conta' : 'Entrar')}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError('');
            setMessage('');
          }}
          disabled={loading}
          style={{ 
            background: 'transparent', 
            color: 'var(--accent)', 
            border: 'none', 
            fontSize: '14px', 
            marginTop: '24px', 
            width: '100%',
            fontWeight: '600'
          }}
        >
          {isRegistering ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
        </button>
      </motion.div>

      <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '24px', textAlign: 'center', opacity: 0.6 }}>
        Ao continuar, você concorda com os Termos de Uso e Privacidade do Motoboot.
      </p>
    </div>
  );
}
