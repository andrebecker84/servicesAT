import { useEffect, useRef, useState } from 'react';
import { IconPlayerPlayFilled, IconPlayerPauseFilled, IconChevronDown } from '@tabler/icons-react';

const VIDEOS = [
  '/videos/01-blood-pressure.mp4',
  '/videos/02-rehab.mp4',
  '/videos/03-consultation.mp4',
];

export default function VideoHero({ children, status }) {
  const videoRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);

  // Troca de fonte ao avançar no loop: recarrega e dá play se estiver tocando.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.load();
    if (playing) v.play().catch(() => {});
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  const proximo = () => setIdx(i => (i + 1) % VIDEOS.length);

  const alternar = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  return (
    <section className="video-hero">
      <video
        ref={videoRef}
        className="video-hero-bg"
        src={VIDEOS[idx]}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={proximo}
      />
      <div className="video-hero-overlay" />

      {status && <div className="video-hero-status">{status}</div>}

      <div className="video-hero-content">{children}</div>

      <button
        className="video-hero-toggle"
        onClick={alternar}
        aria-label={playing ? 'Pausar vídeo' : 'Reproduzir vídeo'}
      >
        {playing ? <IconPlayerPauseFilled size={18} /> : <IconPlayerPlayFilled size={18} />}
      </button>

      <div className="video-hero-dots" role="tablist" aria-label="Selecionar vídeo">
        {VIDEOS.map((_, i) => (
          <button
            key={i}
            className={i === idx ? 'active' : ''}
            onClick={() => setIdx(i)}
            aria-label={`Vídeo ${i + 1}`}
            aria-selected={i === idx}
          />
        ))}
      </div>

      <button
        className="video-hero-scroll"
        aria-label="Rolar para baixo"
        onClick={() => window.scrollTo({ top: window.innerHeight - 60, behavior: 'smooth' })}
      >
        <IconChevronDown size={26} stroke={2} />
      </button>
    </section>
  );
}
