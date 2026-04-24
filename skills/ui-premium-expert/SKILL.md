---
name: ui-premium-expert
description: Especialista no design system, glassmorphism e animações do app Motoboot.
---

# Skill UI Premium (Motoboot)

O aplicativo **Motoboot** não é um sistema básico. O usuário exige um design com aparência "Premium", **Dark Mode** obrigatório e interações sofisticadas.

## Os Pilares do Design Motoboot
1. **Fundo Escuro Constante**: O app roda em uma paleta dark para dar destaque a cores vibrantes.
2. **Glassmorphism (Efeito Vidro)**: Painéis, modais e headers devem usar fundo translúcido e desfoque (`backdrop-filter`).
3. **Micro-interações (Framer Motion)**: Elementos não devem "brotar" secamente na tela. Tudo deve ter animações fluidas de entrada.

## Implementando Glassmorphism (CSS Modules ou Tailwind)
Se você for criar um card ou container, use esta base para o efeito vidro no Tailwind:
`bg-black/40 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl`

Ou, se estiver usando CSS puro (`.module.css`):
```css
.glassPanel {
  background: rgba(20, 20, 20, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  border-radius: 1rem;
}
```

## Implementando Animações com Framer Motion
Todo componente novo ou transição de estado deve ser envolvido no Framer Motion. Use o import `'use client'` para isso.

```tsx
'use client';
import { motion } from 'framer-motion';

// Padrão de fade in slide up (entrada premium)
export const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export default function PremiumCard({ children }) {
  return (
    <motion.div 
      variants={fadeUpVariant}
      initial="hidden"
      animate="visible"
      className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl"
    >
      {children}
    </motion.div>
  );
}
```

## Diretrizes para a IA:
- **Nunca** gere interfaces "brancas e sem formatação". 
- Se for criar botões de destaque, use cores vibrantes (Laranja forte Motoboot) com hover (`hover:brightness-110 hover:scale-105 transition-all`).
- Sempre importe a biblioteca `framer-motion` para animações em tela e popups.
