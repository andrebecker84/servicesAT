import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  IconUsers,
  IconStethoscope,
  IconCalendarCheck,
  IconBed,
  IconTrophy,
  IconArrowRight,
  IconShieldLock,
  IconHeartHandshake,
  IconServer2,
  IconCheck,
  IconActivityHeartbeat,
} from '@tabler/icons-react';
import { health, listarPacientes, listarMedicos, listarConsultas, listarInternacoes } from '../api';
import ScrollHero from '../components/ScrollHero';
import Reveal from '../components/Reveal';
import StatNumber from '../components/StatNumber';
import nappyImg from '../assets/nappy-1Y7ynoLFFDY-unsplash.jpg';

const MODULOS = [
  { to: '/pacientes',   label: 'Pacientes',   Icon: IconUsers,         desc: 'Cadastrar, buscar e remover pacientes' },
  { to: '/medicos',     label: 'Médicos',      Icon: IconStethoscope,   desc: 'Cadastrar e listar médicos por especialidade' },
  { to: '/consultas',   label: 'Consultas',    Icon: IconCalendarCheck, desc: 'Registrar consultas entre pacientes e médicos' },
  { to: '/internacoes', label: 'Internações',  Icon: IconBed,           desc: 'Gerenciar internações e altas hospitalares' },
  { to: '/ranking',     label: 'Ranking',      Icon: IconTrophy,        desc: 'Médicos com maior número de atendimentos' },
  { href: 'http://localhost:8090/actuator/health', label: 'Monitoramento', Icon: IconActivityHeartbeat, desc: 'Health check e status da aplicação (Actuator)', external: true },
];

const DESTAQUES = [
  { Icon: IconShieldLock,     titulo: 'Segurança e privacidade', texto: 'Autenticação por perfil e dados protegidos, do cadastro à alta hospitalar.' },
  { Icon: IconHeartHandshake, titulo: 'Cuidado contínuo',        texto: 'Consultas, internações e histórico do paciente em um fluxo único e claro.' },
  { Icon: IconServer2,        titulo: 'Tecnologia confiável',    texto: 'Spring Boot e PostgreSQL com health check e deploy em containers Docker.' },
];

const EXAMES = [
  { video: '/videos/exam-neuro.mp4',  tag: 'Neurologia',        titulo: 'Cérebro e sistema nervoso', texto: 'Eletroencefalograma e ressonância de alta definição para avaliação neurológica.' },
  { video: '/videos/exam-dna.mp4',    tag: 'Genética',          titulo: 'Análise de DNA humano',     texto: 'Exames genéticos e biologia molecular para diagnósticos de precisão.' },
  { video: '/videos/exam-cardio.mp4', tag: 'Cardiovascular',    titulo: 'Coração e vasos sanguíneos', texto: 'Ecocardiograma, doppler vascular e mapeamento cardiovascular completo.' },
  { video: '/videos/exam-lab.mp4',    tag: 'Análises clínicas', titulo: 'Exames laboratoriais',      texto: 'Hemograma, bioquímica e sorologia integrados ao prontuário do paciente.' },
];

export default function Dashboard() {
  const [status, setStatus] = useState(null);
  const [totais, setTotais] = useState({ pacientes: null, medicos: null, consultas: null, internacoes: null });

  useEffect(() => {
    health().then(setStatus).catch(() => setStatus({ status: 'DOWN' }));
    listarPacientes().then(d => setTotais(t => ({ ...t, pacientes: d.length }))).catch(() => {});
    listarMedicos().then(d => setTotais(t => ({ ...t, medicos: d.length }))).catch(() => {});
    listarConsultas().then(d => setTotais(t => ({ ...t, consultas: d.length }))).catch(() => {});
    listarInternacoes().then(d => setTotais(t => ({ ...t, internacoes: d.length }))).catch(() => {});
  }, []);

  const up = status?.status === 'UP';
  const dbUp = status?.components?.db?.status === 'UP';

  const statusBadge = (
    <div className={`hero-status ${up ? 'up' : status ? 'down' : ''}`}>
      <span className="status-dot" />
      {status ? (up ? 'Sistema operacional' : 'Sistema indisponível') : 'Verificando...'}
      {dbUp && (
        <>
          <span className="status-sep">·</span>
          PostgreSQL
          <IconCheck size={15} stroke={3} className="status-check" />
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Hero scrollytelling (imagem + 3 vídeos com mensagens) */}
      <ScrollHero status={statusBadge} />

      <div className="page">
        {/* Stats animados (count-up) */}
        <Reveal>
          <section className="stats-minimax">
            <div className="stat-mm">
              <div className="stat-mm-num"><StatNumber value={totais.pacientes} /></div>
              <div className="stat-mm-label">Pacientes cadastrados</div>
            </div>
            <div className="stat-mm">
              <div className="stat-mm-num"><StatNumber value={totais.medicos} /></div>
              <div className="stat-mm-label">Médicos no corpo clínico</div>
            </div>
            <div className="stat-mm">
              <div className="stat-mm-num"><StatNumber value={totais.consultas} /></div>
              <div className="stat-mm-label">Consultas registradas</div>
            </div>
            <div className="stat-mm">
              <div className="stat-mm-num"><StatNumber value={totais.internacoes} /></div>
              <div className="stat-mm-label">Internações ativas e concluídas</div>
            </div>
          </section>
        </Reveal>

        {/* Módulos */}
        <Reveal delay={80}>
          <h2 className="section-heading">Módulos do sistema</h2>
          <div className="modules-grid">
            {MODULOS.map(({ to, href, label, Icon, desc, external }) => {
              const conteudo = (
                <>
                  <Icon className="module-card-bg" size={150} stroke={1.1} />
                  <div className="module-card-content">
                    <div className="module-card-label">{label}</div>
                    <div className="module-card-desc">{desc}</div>
                  </div>
                </>
              );
              return external ? (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="module-card">{conteudo}</a>
              ) : (
                <Link key={to} to={to} className="module-card">{conteudo}</Link>
              );
            })}
          </div>
        </Reveal>

        {/* Destaques (texto + cards) */}
        <section className="meta-feature">
          <Reveal className="meta-feature-intro">
            <h2 className="meta-feature-title">Tecnologia a serviço do cuidado</h2>
            <p className="meta-feature-sub">
              Uma base sólida para o dia a dia clínico, com segurança, clareza e
              disponibilidade em cada etapa do atendimento.
            </p>
            <Link to="/ranking" className="btn btn-primary btn-icon">
              Ver ranking de médicos <IconArrowRight size={17} stroke={2} />
            </Link>
          </Reveal>
          <div className="meta-feature-cards">
            {DESTAQUES.map(({ Icon, titulo, texto }, i) => (
              <Reveal key={titulo} delay={i * 110}>
                <div className="meta-card">
                  <span className="meta-card-icon"><Icon size={24} stroke={1.7} /></span>
                  <div>
                    <h3>{titulo}</h3>
                    <p>{texto}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Ações do hospital (vídeo) */}
        <Reveal>
          <section className="video-cta">
            <h2 className="video-cta-title">Conheça as ações do nosso hospital</h2>
            <p className="video-cta-sub">
              Cuidado humano e tecnologia caminhando juntos, da recepção à alta.
            </p>
            <div className="video-cta-actions">
              <Link to="/pacientes" className="btn btn-primary">Começar agora</Link>
              <Link to="/ranking" className="btn btn-ghost btn-icon">
                Ver ranking <IconArrowRight size={16} stroke={2} />
              </Link>
            </div>
            <div className="video-cta-frame">
              {/* Substitua por /videos/uti.mp4 quando o vídeo da UTI estiver disponível */}
              <video src="/videos/02-rehab.mp4" autoPlay muted loop playsInline />
            </div>
          </section>
        </Reveal>

        {/* Destaques em exames clínicos (notícias) */}
        <section className="news">
          <Reveal>
            <h2 className="news-title">Destaques em exames clínicos</h2>
            <p className="news-sub">Excelência em diagnóstico e acompanhamento, em todas as especialidades.</p>
          </Reveal>
          <div className="news-grid">
            {EXAMES.map(({ video, tag, titulo, texto }, i) => (
              <Reveal key={titulo} delay={i * 90}>
                <article className="news-card">
                  <div className="news-thumb">
                    <video src={video} autoPlay muted loop playsInline preload="metadata" />
                    <span className="news-thumb-tag">{tag}</span>
                  </div>
                  <h3>{titulo}</h3>
                  <p>{texto}</p>
                  <Link to="/medicos" className="news-link">
                    <span className="news-link-arrow"><IconArrowRight size={15} stroke={2} /></span>
                    Saiba mais
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Feature band (imagem nappy) */}
        <Reveal>
          <section className="feature-band">
            <img className="feature-band-bg" src={nappyImg} alt="" />
            <div className="feature-band-overlay" />
            <div className="feature-band-content">
              <span className="hero-eyebrow">Tecnologia + Cuidado</span>
              <h2 className="feature-band-title">Saúde na palma da mão</h2>
              <p className="feature-band-sub">
                Uma plataforma pensada para agilizar o dia a dia clínico, do agendamento
                ao acompanhamento, com dados sempre acessíveis e seguros.
              </p>
              <Link to="/medicos" className="btn btn-primary btn-icon">
                Conhecer os médicos <IconArrowRight size={17} stroke={2} />
              </Link>
            </div>
          </section>
        </Reveal>
      </div>
    </>
  );
}
