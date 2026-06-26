import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconMouse, IconArrowRight } from '@tabler/icons-react';

const FASES = [
  { src: '/videos/hero-intro.mp4',      eyebrow: 'Sistema de Gestão Hospitalar', titulo: ['Estamos cuidando do', 'futuro da saúde'], cta: true },
  { src: '/videos/hero-people.mp4',     eyebrow: 'Pessoas no centro',            titulo: ['Cuidado que começa', 'em cada pessoa'] },
  { src: '/videos/01-blood-pressure.mp4', eyebrow: 'Diagnóstico preciso',        titulo: ['Precisão no momento', 'que mais importa'] },
  { src: '/videos/03-consultation.mp4', eyebrow: 'Atendimento humano',           titulo: ['Humanidade em', 'cada consulta'] },
];

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export default function ScrollHero({ status }) {
  const trackRef = useRef(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const calc = () => {
      raf = 0;
      const el = trackRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const passado = -el.getBoundingClientRect().top;
      setP(clamp(total > 0 ? passado / total : 0, 0, 1));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(calc); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    calc();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const N = FASES.length;            // 4 vídeos
  const f = p * N;                   // 0..4
  const fase = clamp(Math.floor(f), 0, N - 1);
  const frac = f - fase;
  const prox = Math.min(fase + 1, N - 1);
  const cross = clamp((frac - 0.7) / 0.3, 0, 1);   // cross-fade nos últimos 30%

  const camadaOp = (i) => {
    if (i === fase && i === prox) return 1;
    if (i === fase) return 1 - cross;
    if (i === prox) return cross;
    return 0;
  };

  const msgIndex = cross > 0.5 ? prox : fase;
  const msg = FASES[msgIndex];
  // saida: começa a esvaecer aos 88% do scroll e termina em 100%
  const saida = clamp((p - 0.88) / 0.12, 0, 1);
  const introVisivel = msgIndex === 0;

  return (
    <section className="scroll-hero" ref={trackRef} style={{ height: `${N * 58}vh` }}>
      <div
        className="scroll-hero-sticky"
        style={{
          opacity: 1 - saida,
          // sobe fisicamente enquanto esmaece, puxando o conteúdo para cima
          transform: `translateY(${saida * -60}px)`,
        }}
      >
        {FASES.map((fa, k) => (
          <video
            key={fa.src}
            className="sh-layer sh-video"
            src={fa.src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            style={{ opacity: camadaOp(k) }}
          />
        ))}
        <div className="sh-overlay" />

        {status && <div className="video-hero-status">{status}</div>}

        <div className="sh-content" style={{ transform: `translateY(${saida * -40}px)` }}>
          <div className="sh-message" key={msgIndex}>
            <span className="hero-eyebrow">{msg.eyebrow}</span>
            <h1 className="sh-title">
              {msg.titulo.map((linha, i) => <span key={i}>{linha}</span>)}
            </h1>
            {msg.cta && (
              <Link to="/pacientes" className="btn btn-primary btn-icon sh-cta">
                Nossa missão <IconArrowRight size={17} stroke={2} />
              </Link>
            )}
          </div>
        </div>

        <div className="sh-dots" aria-hidden="true">
          {FASES.map((_, i) => <span key={i} className={i === msgIndex ? 'active' : ''} />)}
        </div>

        <div
          className="sh-scroll-hint"
          style={{ opacity: introVisivel ? 1 - saida : 0.55 - saida }}
          aria-hidden="true"
        >
          <IconMouse size={26} stroke={1.7} />
          <span className="sh-wheel" />
        </div>
      </div>
    </section>
  );
}
