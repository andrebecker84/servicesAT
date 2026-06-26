import { useEffect, useRef, useState } from 'react';

export default function StatNumber({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  const rafRef = useRef(null);

  useEffect(() => {
    if (value == null) return;
    const el = ref.current;
    if (!el) return;

    const animar = () => {
      const inicio = performance.now();
      const passo = (agora) => {
        const p = Math.min((agora - inicio) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(eased * value));
        if (p < 1) rafRef.current = requestAnimationFrame(passo);
      };
      rafRef.current = requestAnimationFrame(passo);
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          animar();
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  return (
    <span className="lcd" ref={ref}>
      {String(display).split('').map((d, i) => (
        <span className="lcd-digit" key={i}>{d}</span>
      ))}
    </span>
  );
}
