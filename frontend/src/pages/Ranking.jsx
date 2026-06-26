import { useEffect, useState, useCallback } from 'react';
import { IconRefresh, IconTrophy, IconMedal } from '@tabler/icons-react';
import { rankingMedicos } from '../api';
import Reveal from '../components/Reveal';

const avatarUrl = (nome) =>
  `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(nome)}&backgroundColor=dbeafe,e0e7ff,cffafe,fce7f3,fef3c7&radius=50`;

const MEDALHA = ['🥇', '🥈', '🥉'];

export default function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregar = useCallback(() => {
    setLoading(true);
    rankingMedicos()
      .then(setRanking)
      .catch(() => setRanking([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(carregar, [carregar]);

  const top10 = ranking.slice(0, 10);
  const podio = top10.slice(0, 3);
  const maxConsultas = top10.reduce((m, r) => Math.max(m, Number(r.totalConsultas)), 0) || 1;
  const totalConsultas = ranking.reduce((s, r) => s + Number(r.totalConsultas), 0);

  // Ordem visual do pódio: 2º à esquerda, 1º ao centro, 3º à direita
  const ordemPodio = podio.length === 3 ? [podio[1], podio[0], podio[2]] : podio;
  const posReal = (m) => podio.indexOf(m); // 0=1º, 1=2º, 2=3º

  return (
    <div className="page">
      <h1 className="page-title">Ranking de Médicos</h1>

      {!loading && top10.length > 0 && (
        <Reveal>
          <div className="rank-summary">
            <div className="rank-summary-item">
              <span className="rank-summary-icon"><IconTrophy size={22} stroke={1.7} /></span>
              <div>
                <div className="rank-summary-num">{ranking[0]?.nome}</div>
                <div className="rank-summary-label">Médico com mais atendimentos</div>
              </div>
            </div>
            <div className="rank-summary-item">
              <div className="rank-summary-num big">{totalConsultas}</div>
              <div className="rank-summary-label">Consultas realizadas no total</div>
            </div>
            <div className="rank-summary-item">
              <div className="rank-summary-num big">{ranking.length}</div>
              <div className="rank-summary-label">Médicos no ranking</div>
            </div>
          </div>
        </Reveal>
      )}

      {/* Pódio dos 3 primeiros — sem contagem, apenas posição */}
      {!loading && podio.length > 0 && (
        <Reveal delay={60}>
          <div className="podium">
            {ordemPodio.map((m) => {
              const pos = posReal(m);
              return (
                <div className={`podium-col p${pos + 1}`} key={m.id}>
                  <div className="podium-avatar-wrap">
                    <img className="podium-avatar" src={avatarUrl(m.nome)} alt={m.nome} loading="lazy" />
                    <span className="podium-medal"><IconMedal size={18} stroke={2} /></span>
                  </div>
                  <div className="podium-name">{m.nome}</div>
                  <div className="podium-spec">{m.especialidade}</div>
                  <div className="podium-stand">
                    <span className="podium-rank">{pos + 1}º</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      )}

      {/* Top 10 completo com medalhas nos 3 primeiros */}
      <Reveal delay={120}>
        <div className="card">
          <div className="card-title-row">
            <span>Classificação completa (Top 10)</span>
            <button className="btn btn-soft btn-sm btn-icon" onClick={carregar}>
              <IconRefresh size={14} stroke={1.9} /> Atualizar
            </button>
          </div>

          {loading ? (
            <div className="loading">Carregando ranking...</div>
          ) : top10.length === 0 ? (
            <div className="loading">Nenhuma consulta registrada ainda.</div>
          ) : (
            <div className="rank-chart">
              {top10.map((m, i) => (
                <div className={`rank-row ${i < 3 ? 'top' : ''}`} key={m.id}>
                  <span className="rank-pos">
                    {i < 3 ? MEDALHA[i] : `${i + 1}º`}
                  </span>
                  <img className="rank-avatar" src={avatarUrl(m.nome)} alt="" loading="lazy" />
                  <div className="rank-info">
                    <div className="rank-name">
                      {m.nome}
                      <span className="badge badge-blue">{m.especialidade}</span>
                    </div>
                    <div className="rank-bar-track">
                      <div
                        className="rank-bar-fill"
                        style={{ width: `${(Number(m.totalConsultas) / maxConsultas) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="rank-count">{m.totalConsultas}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Reveal>
    </div>
  );
}
