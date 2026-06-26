import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Pacientes from './pages/Pacientes';
import Medicos from './pages/Medicos';
import Consultas from './pages/Consultas';
import Internacoes from './pages/Internacoes';
import Ranking from './pages/Ranking';

/** Arrastar com o mouse para rolar a página (grab & drag). */
function useDragScroll() {
  useEffect(() => {
    let ativo = false;
    let yInicial = 0;
    let scrollInicial = 0;
    let moveu = false;

    const ehInterativo = (alvo) =>
      alvo.closest('a, button, input, select, textarea, video, label, .modal-overlay, .video-hero-toggle, .video-hero-dots');

    const onDown = (e) => {
      if (e.button !== 0 || ehInterativo(e.target)) return;
      ativo = true;
      moveu = false;
      yInicial = e.clientY;
      scrollInicial = window.scrollY;
    };
    const onMove = (e) => {
      if (!ativo) return;
      const delta = e.clientY - yInicial;
      if (Math.abs(delta) > 4) {
        moveu = true;
        document.body.classList.add('dragging');
      }
      window.scrollTo(0, scrollInicial - delta);
    };
    const onUp = () => {
      ativo = false;
      if (moveu) document.body.classList.remove('dragging');
    };

    window.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);
}

/** Rola para o topo ao trocar de rota. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  useDragScroll();
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/"            element={<Dashboard />} />
          <Route path="/pacientes"   element={<Pacientes />} />
          <Route path="/medicos"     element={<Medicos />} />
          <Route path="/consultas"   element={<Consultas />} />
          <Route path="/internacoes" element={<Internacoes />} />
          <Route path="/ranking"     element={<Ranking />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
