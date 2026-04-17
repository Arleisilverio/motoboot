'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, Navigation, DollarSign, Loader2, Route, CheckCircle, AlertCircle, LocateFixed } from 'lucide-react';
import styles from '@/styles/home.module.css';
import calcStyles from '@/styles/calculadora.module.css';

// ─── Tipos ───────────────────────────────────────────────────
interface GeoResult {
  lat: string;
  lon: string;
  display_name: string;
}

interface Resultado {
  distanciaKm: number;
  duracaoMin: number;
  valorTotal: number;
}

// ─── API Helpers (100% gratuitas, sem chave) ─────────────────

/** Nominatim: converte endereço em lat/lon */
async function geocodificar(endereco: string): Promise<GeoResult> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endereco)}&format=json&limit=1&countrycodes=br`;
  const res = await fetch(url, {
    headers: { 'Accept-Language': 'pt-BR', 'User-Agent': 'Motoboot-App/1.0' },
  });
  const data: GeoResult[] = await res.json();
  if (!data || data.length === 0) throw new Error('Endereço não encontrado. Tente ser mais específico.');
  return data[0];
}

/** OSRM: calcula distância real de rota entre dois pontos */
async function calcularRota(
  latA: number, lonA: number,
  latB: number, lonB: number
): Promise<{ distanciaKm: number; duracaoMin: number }> {
  const url = `https://router.project-osrm.org/route/v1/driving/${lonA},${latA};${lonB},${latB}?overview=false`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.code !== 'Ok') throw new Error('Não foi possível calcular a rota entre esses pontos.');
  const { distance, duration } = data.routes[0];
  return {
    distanciaKm: parseFloat((distance / 1000).toFixed(2)),
    duracaoMin: Math.round(duration / 60),
  };
}

// ─── Componente Principal ─────────────────────────────────────
export default function CalculadoraPage() {
  const [pontoA, setPontoA] = useState('');
  const [pontoB, setPontoB] = useState('');
  const [valorPorKm, setValorPorKm] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingGps, setLoadingGps] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [enderecoALabel, setEnderecoALabel] = useState('');
  const [enderecoBLabel, setEnderecoBLabel] = useState('');

  // Pega localização atual via GPS do browser
  const usarLocalizacaoAtual = useCallback(() => {
    if (!navigator.geolocation) {
      setErro('Geolocalização não suportada neste dispositivo.');
      return;
    }
    setLoadingGps(true);
    setErro(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // Reverse geocode para mostrar o endereço legível
          const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=pt-BR`;
          const res = await fetch(url, { headers: { 'User-Agent': 'Motoboot-App/1.0' } });
          const data = await res.json();
          const label = data.display_name?.split(',').slice(0, 3).join(', ') ?? `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          setPontoA(`${latitude},${longitude}`);
          setEnderecoALabel(label);
        } catch {
          setPontoA(`${latitude},${longitude}`);
          setEnderecoALabel(`Localização: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } finally {
          setLoadingGps(false);
        }
      },
      (err) => {
        setLoadingGps(false);
        if (err.code === 1) setErro('Permissão de localização negada. Permita o acesso nas configurações.');
        else setErro('Não foi possível obter sua localização. Tente novamente.');
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  // Verifica se pontoA é coordenada lat,lon
  function isCoordenada(val: string): { lat: number; lon: number } | null {
    const parts = val.split(',');
    if (parts.length === 2) {
      const lat = parseFloat(parts[0].trim());
      const lon = parseFloat(parts[1].trim());
      if (!isNaN(lat) && !isNaN(lon)) return { lat, lon };
    }
    return null;
  }

  const calcular = async () => {
    setErro(null);
    setResultado(null);

    if (!pontoA.trim() || !pontoB.trim()) {
      setErro('Preencha o Ponto A e o Ponto B antes de calcular.');
      return;
    }
    const preco = parseFloat(valorPorKm.replace(',', '.'));
    if (!preco || preco <= 0) {
      setErro('Informe um valor por km válido (ex: 2,50).');
      return;
    }

    setLoading(true);
    try {
      // Resolve Ponto A
      let latA: number, lonA: number;
      const coordA = isCoordenada(pontoA);
      if (coordA) {
        latA = coordA.lat; lonA = coordA.lon;
      } else {
        const geoA = await geocodificar(pontoA);
        latA = parseFloat(geoA.lat); lonA = parseFloat(geoA.lon);
        setEnderecoALabel(geoA.display_name.split(',').slice(0, 3).join(', '));
      }

      // Resolve Ponto B
      const geoB = await geocodificar(pontoB);
      const latB = parseFloat(geoB.lat);
      const lonB = parseFloat(geoB.lon);
      setEnderecoBLabel(geoB.display_name.split(',').slice(0, 3).join(', '));

      // Calcula rota
      const { distanciaKm, duracaoMin } = await calcularRota(latA, lonA, latB, lonB);
      const valorTotal = parseFloat((distanciaKm * preco).toFixed(2));

      setResultado({ distanciaKm, duracaoMin, valorTotal });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro inesperado. Tente novamente.';
      setErro(msg);
    } finally {
      setLoading(false);
    }
  };

  const limpar = () => {
    setPontoA(''); setPontoB(''); setValorPorKm('');
    setResultado(null); setErro(null);
    setEnderecoALabel(''); setEnderecoBLabel('');
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerRight} style={{ gap: '12px' }}>
            <Link href="/ferramentas" className={styles.iconBtn} aria-label="Voltar">
              <ArrowLeft size={20} />
            </Link>
            <div className={styles.logoWrap}>
              <Image
                src="https://i.supaimg.com/ab10c538-a9f0-4a7a-9c0d-5a65ded30e00/98114ba7-a562-42fe-b43a-a5b083b9abd2.png"
                alt="Motoboot Logo"
                width={110}
                height={34}
                className={styles.logoImage}
                priority
              />
            </div>
          </div>
        </div>
      </header>

      <main className={styles.pageContent}>
        <div className={calcStyles.wrapper}>
          {/* Título */}
          <div className={calcStyles.titleRow}>
            <div className={calcStyles.titleIcon}>
              <Route size={22} />
            </div>
            <div>
              <h1 className={calcStyles.title}>Calculadora de Rota</h1>
              <p className={calcStyles.subtitle}>Calcule o valor da sua corrida com precisão</p>
            </div>
          </div>

          {/* Formulário */}
          <div className={calcStyles.card}>
            {/* Ponto A */}
            <div className={calcStyles.fieldGroup}>
              <label className={calcStyles.label}>
                <MapPin size={14} className={calcStyles.labelIcon} style={{ color: 'var(--accent)' }} />
                Ponto A — Origem
              </label>
              <div className={calcStyles.inputRow}>
                <input
                  id="input-ponto-a"
                  type="text"
                  className={calcStyles.input}
                  placeholder="Ex: Av. Paulista, 1000, São Paulo"
                  value={enderecoALabel || pontoA}
                  onChange={(e) => {
                    setPontoA(e.target.value);
                    setEnderecoALabel('');
                  }}
                  disabled={loadingGps}
                />
                <button
                  id="btn-gps"
                  className={calcStyles.gpsBtn}
                  onClick={usarLocalizacaoAtual}
                  disabled={loadingGps}
                  title="Usar localização atual"
                  aria-label="Usar minha localização atual"
                >
                  {loadingGps
                    ? <Loader2 size={18} className={calcStyles.spinning} />
                    : <LocateFixed size={18} />
                  }
                </button>
              </div>
              {enderecoALabel && (
                <p className={calcStyles.resolvedLabel}>
                  <CheckCircle size={12} /> {enderecoALabel}
                </p>
              )}
            </div>

            {/* Ponto B */}
            <div className={calcStyles.fieldGroup}>
              <label className={calcStyles.label}>
                <Navigation size={14} className={calcStyles.labelIcon} style={{ color: 'var(--success)' }} />
                Ponto B — Destino
              </label>
              <input
                id="input-ponto-b"
                type="text"
                className={calcStyles.input}
                placeholder="Ex: Shopping Ibirapuera, São Paulo"
                value={pontoB}
                onChange={(e) => { setPontoB(e.target.value); setEnderecoBLabel(''); }}
              />
              {enderecoBLabel && (
                <p className={calcStyles.resolvedLabel}>
                  <CheckCircle size={12} /> {enderecoBLabel}
                </p>
              )}
            </div>

            {/* Valor por KM */}
            <div className={calcStyles.fieldGroup}>
              <label className={calcStyles.label}>
                <DollarSign size={14} className={calcStyles.labelIcon} style={{ color: 'var(--accent-2)' }} />
                Seu valor por km (R$)
              </label>
              <input
                id="input-valor-km"
                type="number"
                inputMode="decimal"
                className={calcStyles.input}
                placeholder="Ex: 2.50"
                value={valorPorKm}
                onChange={(e) => setValorPorKm(e.target.value)}
                min="0"
                step="0.10"
              />
            </div>

            {/* Erro */}
            {erro && (
              <div className={calcStyles.erroBox} role="alert">
                <AlertCircle size={16} />
                <span>{erro}</span>
              </div>
            )}

            {/* Botões */}
            <div className={calcStyles.btnRow}>
              <button
                id="btn-calcular"
                className={calcStyles.btnPrimary}
                onClick={calcular}
                disabled={loading}
              >
                {loading
                  ? <><Loader2 size={18} className={calcStyles.spinning} /> Calculando...</>
                  : <><Route size={18} /> Calcular Rota</>
                }
              </button>
              {(resultado || erro) && (
                <button id="btn-limpar" className={calcStyles.btnSecondary} onClick={limpar}>
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Resultado */}
          {resultado && (
            <div className={calcStyles.resultCard} role="region" aria-label="Resultado do cálculo">
              <div className={calcStyles.resultHeader}>
                <CheckCircle size={18} className={calcStyles.resultIcon} />
                <span>Rota Calculada</span>
              </div>

              <div className={calcStyles.resultGrid}>
                <div className={calcStyles.resultItem}>
                  <span className={calcStyles.resultItemLabel}>Distância</span>
                  <span className={calcStyles.resultItemValue}>
                    {resultado.distanciaKm.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    <span className={calcStyles.resultUnit}> km</span>
                  </span>
                </div>
                <div className={calcStyles.resultItem}>
                  <span className={calcStyles.resultItemLabel}>Tempo est.</span>
                  <span className={calcStyles.resultItemValue}>
                    {resultado.duracaoMin}
                    <span className={calcStyles.resultUnit}> min</span>
                  </span>
                </div>
              </div>

              <div className={calcStyles.resultTotal}>
                <span className={calcStyles.resultTotalLabel}>Valor da Corrida</span>
                <span className={calcStyles.resultTotalValue}>
                  {resultado.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>

              <p className={calcStyles.resultNote}>
                * Distância calculada por via de trânsito real (não linha reta)
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
