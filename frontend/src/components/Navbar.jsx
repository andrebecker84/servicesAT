import { NavLink } from 'react-router-dom';
import {
  IconLayoutDashboard,
  IconUsers,
  IconStethoscope,
  IconCalendarCheck,
  IconBed,
  IconTrophy,
  IconBell,
  IconUserCircle,
} from '@tabler/icons-react';

const LINKS = [
  { to: '/',             label: 'Dashboard',   Icon: IconLayoutDashboard, end: true },
  { to: '/pacientes',    label: 'Pacientes',   Icon: IconUsers },
  { to: '/medicos',      label: 'Médicos',     Icon: IconStethoscope },
  { to: '/consultas',    label: 'Consultas',   Icon: IconCalendarCheck },
  { to: '/internacoes',  label: 'Internações', Icon: IconBed },
  { to: '/ranking',      label: 'Ranking',     Icon: IconTrophy },
];

export default function Navbar() {
  return (
    <nav>
      <div className="nav-inner">
        <div className="nav-left">
          <span className="nav-logo">
            <span className="nav-logo-badge">
              <svg width="18" height="18" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M13 6h6v7h7v6h-7v7h-6v-7H6v-6h7z" fill="#fff" />
              </svg>
            </span>
            Hospital
          </span>
          <div className="nav-links">
            {LINKS.map(({ to, label, Icon, end }) => (
              <NavLink key={to} to={to} end={end}>
                <Icon size={17} stroke={1.75} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="nav-right">
          <button className="nav-icon-btn" aria-label="Notificações" title="Notificações">
            <IconBell size={20} stroke={1.7} />
            <span className="nav-badge-dot" />
          </button>
          <button className="nav-icon-btn" aria-label="Conta" title="Conta">
            <IconUserCircle size={22} stroke={1.7} />
          </button>
        </div>
      </div>
    </nav>
  );
}
