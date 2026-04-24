'use client';

import { useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import styles from './login.module.css';

type Tab = 'login' | 'cadastro' | 'esqueceu';
type Status = { type: 'success' | 'error'; message: string } | null;

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Cadastro fields
  const [cadNome, setCadNome] = useState('');
  const [cadWhats, setCadWhats] = useState('');
  const [cadEmail, setCadEmail] = useState('');
  const [cadPass, setCadPass] = useState('');

  // Esqueceu senha
  const [resetEmail, setResetEmail] = useState('');

  const clearStatus = () => setStatus(null);

  // ── FORMATA WHATSAPP ───────────────────────────────────────
  const formatWhats = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  // ── LOGIN ──────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearStatus();
    if (!loginEmail || !loginPass) {
      setStatus({ type: 'error', message: 'Preencha e-mail e senha.' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPass,
    });
    setLoading(false);
    if (error) {
      const msg =
        error.message.includes('Invalid login credentials')
          ? 'E-mail ou senha incorretos.'
          : error.message.includes('Email not confirmed')
          ? 'Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.'
          : 'Erro ao entrar. Tente novamente.';
      setStatus({ type: 'error', message: msg });
    }
    // Sucesso: AuthProvider redireciona automaticamente
  };

  // ── CADASTRO ───────────────────────────────────────────────
  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    clearStatus();
    if (!cadNome.trim() || !cadEmail.trim() || !cadPass || !cadWhats.trim()) {
      setStatus({ type: 'error', message: 'Preencha todos os campos.' });
      return;
    }
    if (cadPass.length < 6) {
      setStatus({ type: 'error', message: 'A senha precisa ter no mínimo 6 caracteres.' });
      return;
    }
    const digits = cadWhats.replace(/\D/g, '');
    if (digits.length < 10) {
      setStatus({ type: 'error', message: 'WhatsApp inválido. Digite o DDD + número.' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: cadEmail.trim(),
      password: cadPass,
      options: {
        data: {
          name: cadNome.trim(),
          whatsapp: cadWhats,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      const msg =
        error.message.includes('already registered') || error.message.includes('User already registered')
          ? 'Este e-mail já está cadastrado. Tente fazer login.'
          : 'Erro ao cadastrar. Tente novamente.';
      setStatus({ type: 'error', message: msg });
    } else {
      setStatus({
        type: 'success',
        message: '✅ Cadastro realizado! Verifique seu e-mail para confirmar a conta antes de entrar.',
      });
      // Limpa os campos
      setCadNome(''); setCadWhats(''); setCadEmail(''); setCadPass('');
    }
  };

  // ── ESQUECEU SENHA ─────────────────────────────────────────
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    clearStatus();
    if (!resetEmail.trim()) {
      setStatus({ type: 'error', message: 'Digite seu e-mail.' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    setLoading(false);
    if (error) {
      setStatus({ type: 'error', message: 'Não foi possível enviar. Verifique o e-mail digitado.' });
    } else {
      setStatus({
        type: 'success',
        message: '📧 Enviamos um link para redefinir sua senha. Verifique sua caixa de entrada (e o spam).',
      });
      setResetEmail('');
    }
  };

  return (
    <div className={styles.page}>
      {/* FUNDO COM GRADIENTE */}
      <div className={styles.bg} />

      {/* VOLTAR */}
      <Link href="/" className={styles.backBtn}>
        <ArrowLeft size={20} />
        Voltar
      </Link>

      <div className={styles.wrapper}>
        {/* LOGO */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={styles.logo}
        >
          <Image
            src="https://i.supaimg.com/ab10c538-a9f0-4a7a-9c0d-5a65ded30e00/98114ba7-a562-42fe-b43a-a5b083b9abd2.png"
            alt="Motoboot Logo"
            width={160}
            height={52}
            priority
          />
          <p className={styles.tagline}>Comunidade de motoboys do Brasil</p>
        </motion.div>

        {/* CARD PRINCIPAL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={styles.card}
        >
          {/* TABS — só mostra se não é "esqueceu" */}
          {tab !== 'esqueceu' && (
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${tab === 'login' ? styles.tabActive : ''}`}
                onClick={() => { setTab('login'); clearStatus(); }}
              >
                Entrar
              </button>
              <button
                className={`${styles.tab} ${tab === 'cadastro' ? styles.tabActive : ''}`}
                onClick={() => { setTab('cadastro'); clearStatus(); }}
              >
                Cadastrar
              </button>
            </div>
          )}

          {/* ALERTA DE STATUS */}
          <AnimatePresence>
            {status && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`${styles.alert} ${status.type === 'error' ? styles.alertError : styles.alertSuccess}`}
              >
                {status.type === 'error'
                  ? <AlertCircle size={16} />
                  : <CheckCircle size={16} />}
                <span>{status.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── FORM: LOGIN ─── */}
          <AnimatePresence mode="wait">
            {tab === 'login' && (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLogin}
                className={styles.form}
              >
                <div className={styles.field}>
                  <label className={styles.label}>E-mail</label>
                  <div className={styles.inputWrap}>
                    <Mail size={18} className={styles.inputIcon} />
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="seu@email.com"
                      className={styles.input}
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Senha</label>
                  <div className={styles.inputWrap}>
                    <Lock size={18} className={styles.inputIcon} />
                    <input
                      type={showPass ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className={styles.input}
                      value={loginPass}
                      onChange={e => setLoginPass(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() => setShowPass(v => !v)}
                      tabIndex={-1}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.forgotLink}
                  onClick={() => { setTab('esqueceu'); clearStatus(); }}
                >
                  Esqueceu a senha?
                </button>

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? <Loader2 size={20} className={styles.spin} /> : 'Entrar'}
                </button>

                <p className={styles.switchText}>
                  Não tem conta?{' '}
                  <button type="button" onClick={() => { setTab('cadastro'); clearStatus(); }}>
                    Cadastre-se grátis
                  </button>
                </p>
              </motion.form>
            )}

            {/* ─── FORM: CADASTRO ─── */}
            {tab === 'cadastro' && (
              <motion.form
                key="cadastro"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleCadastro}
                className={styles.form}
              >
                <div className={styles.field}>
                  <label className={styles.label}>Seu nome</label>
                  <div className={styles.inputWrap}>
                    <User size={18} className={styles.inputIcon} />
                    <input
                      type="text"
                      autoComplete="name"
                      placeholder="Como você quer ser chamado"
                      className={styles.input}
                      value={cadNome}
                      onChange={e => setCadNome(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>WhatsApp</label>
                  <div className={styles.inputWrap}>
                    <Phone size={18} className={styles.inputIcon} />
                    <input
                      type="tel"
                      autoComplete="tel"
                      placeholder="(11) 99999-9999"
                      className={styles.input}
                      value={cadWhats}
                      onChange={e => setCadWhats(formatWhats(e.target.value))}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>E-mail</label>
                  <div className={styles.inputWrap}>
                    <Mail size={18} className={styles.inputIcon} />
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="seu@email.com"
                      className={styles.input}
                      value={cadEmail}
                      onChange={e => setCadEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Senha</label>
                  <div className={styles.inputWrap}>
                    <Lock size={18} className={styles.inputIcon} />
                    <input
                      type={showPass ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Mínimo 6 caracteres"
                      className={styles.input}
                      value={cadPass}
                      onChange={e => setCadPass(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() => setShowPass(v => !v)}
                      tabIndex={-1}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <span className={styles.hint}>
                    {cadPass.length > 0 && cadPass.length < 6 ? '⚠️ Mínimo 6 caracteres' : ' '}
                  </span>
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? <Loader2 size={20} className={styles.spin} /> : 'Criar minha conta grátis'}
                </button>

                <p className={styles.switchText}>
                  Já tem conta?{' '}
                  <button type="button" onClick={() => { setTab('login'); clearStatus(); }}>
                    Faça login
                  </button>
                </p>
              </motion.form>
            )}

            {/* ─── FORM: ESQUECEU SENHA ─── */}
            {tab === 'esqueceu' && (
              <motion.form
                key="esqueceu"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleReset}
                className={styles.form}
              >
                <div className={styles.resetHeader}>
                  <h2 className={styles.resetTitle}>Redefinir senha</h2>
                  <p className={styles.resetDesc}>
                    Digite seu e-mail e enviaremos um link para você criar uma nova senha.
                  </p>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>E-mail cadastrado</label>
                  <div className={styles.inputWrap}>
                    <Mail size={18} className={styles.inputIcon} />
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="seu@email.com"
                      className={styles.input}
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? <Loader2 size={20} className={styles.spin} /> : 'Enviar link de redefinição'}
                </button>

                <button
                  type="button"
                  className={styles.backToLogin}
                  onClick={() => { setTab('login'); clearStatus(); }}
                >
                  ← Voltar para o login
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* RODAPÉ */}
        <p className={styles.footer}>
          🏍️ Motoboot — Informação, segurança e união na rua
        </p>
      </div>
    </div>
  );
}