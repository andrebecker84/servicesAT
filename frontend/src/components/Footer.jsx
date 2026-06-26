import { Link } from 'react-router-dom';
import { IconBrandGithub, IconBrandLinkedin, IconHeartbeat } from '@tabler/icons-react';

/* Substitua os href "#" pelos seus endereços de GitHub e LinkedIn. */
const SOCIAL = [
  { label: 'GitHub',   href: '#', Icon: IconBrandGithub },
  { label: 'LinkedIn', href: '#', Icon: IconBrandLinkedin },
];

const COLS = [
  {
    title: 'Navegação',
    links: [
      { to: '/pacientes',   label: 'Pacientes' },
      { to: '/medicos',     label: 'Médicos' },
      { to: '/consultas',   label: 'Consultas' },
      { to: '/internacoes', label: 'Internações' },
      { to: '/ranking',     label: 'Ranking' },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { href: 'http://localhost:8090/actuator/health', label: 'Health Check' },
      { href: 'http://localhost:8090/medicos/ranking',  label: 'API · Ranking' },
      { to: '/consultas', label: 'Nova Consulta' },
      { to: '/internacoes', label: 'Nova Internação' },
    ],
  },
  {
    title: 'Sobre',
    links: [
      { href: '#', label: 'DR1-AT' },
      { href: '#', label: 'Eng. de Softwares Escaláveis' },
      { href: '#', label: 'Licença MIT' },
    ],
  },
];

function FooterLink({ to, href, label }) {
  if (to) return <Link to={to}>{label}</Link>;
  return <a href={href} target="_blank" rel="noopener noreferrer">{label}</a>;
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-brand-row">
              <span className="footer-logo">
                <span className="footer-logo-badge">
                  <svg width="16" height="16" viewBox="0 0 32 32" aria-hidden="true">
                    <path d="M13 6h6v7h7v6h-7v7h-6v-7H6v-6h7z" fill="#fff" />
                  </svg>
                </span>
                Hospital
              </span>
              <span className="footer-divider" />
              <IconHeartbeat className="footer-slogan-icon" size={30} stroke={1.8} />
              <span className="footer-tagline">
                Cuidado conectado<br />para <span className="hl">todos</span>
              </span>
            </div>
            <div className="footer-social">
              {SOCIAL.map(({ label, href, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                  <Icon size={20} stroke={1.8} />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-cols">
            {COLS.map(col => (
              <div key={col.title} className="footer-col">
                <h4>{col.title}</h4>
                {col.links.map(l => <FooterLink key={l.label} {...l} />)}
              </div>
            ))}
          </div>
        </div>

        <div className="footer-credits-block">
          <span className="footer-credits-title">Créditos de mídia</span>
          <p>
            <b>Imagens (Unsplash):</b>{' '}
            <a href="https://unsplash.com/pt-br/fotografias/pessoas-andando-em-edificio-de-concreto-branco-durante-o-dia-cq4UJnEhh54" target="_blank" rel="noopener noreferrer">Ricardo Gomez Angel</a>,{' '}
            <a href="https://unsplash.com/pt-br/fotografias/uma-pessoa-segurando-um-telefone-1Y7ynoLFFDY" target="_blank" rel="noopener noreferrer">nappy</a>.
          </p>
          <p>
            <b>Vídeos:</b>{' '}
            <a href="https://pixabay.com/videos/couple-lovers-hands-love-street-152798/" target="_blank" rel="noopener noreferrer">Pixabay (152798)</a>,{' '}
            <a href="https://www.pexels.com/pt-br/video/adultos-vista-traseira-brilhante-luminoso-7224949/" target="_blank" rel="noopener noreferrer">cottonbro studio · Pexels</a>,{' '}
            <a href="https://pixabay.com/videos/brain-mind-knowledge-think-206173/" target="_blank" rel="noopener noreferrer">Pixabay (206173)</a>,{' '}
            <a href="https://www.videezy.com/abstract/56587-3d-animation-graphic-of-human-dna-on-computer-screen" target="_blank" rel="noopener noreferrer">Videezy (DNA)</a>,{' '}
            <a href="https://pixabay.com/videos/blood-vessels-human-body-vein-57691/" target="_blank" rel="noopener noreferrer">Pixabay (57691)</a>,{' '}
            <a href="https://www.pexels.com/pt-br/video/rotacao-sangue-quimica-close-9573756/" target="_blank" rel="noopener noreferrer">Tima Miroshnichenko · Pexels</a>,{' '}
            <a href="https://www.vecteezy.com/" target="_blank" rel="noopener noreferrer">Vecteezy</a>.
          </p>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Hospital · Sistema de Gestão Hospitalar · Licença MIT</span>
          <span>Uso gratuito sob as licenças Unsplash, Pexels, Pixabay, Vecteezy e Videezy</span>
        </div>
      </div>
    </footer>
  );
}
