const CREDENCIAIS = btoa('user:user123');
const CREDENCIAIS_ADMIN = btoa('admin:admin123');

async function req(url, options = {}, admin = false) {
  const cred = admin ? CREDENCIAIS_ADMIN : CREDENCIAIS;
  const res = await fetch('http://localhost:8090' + url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + cred,
    },
    ...options,
  });
  if (res.status === 204) return null;
  if (!res.ok) {
    const err = await res.json().catch(() => ({ erro: res.statusText }));
    throw new Error(err.erro || `${res.status} ${res.statusText}`);
  }
  return res.json();
}

// ── Pacientes ─────────────────────────────────────────────────────────────────
export const listarPacientes    = ()     => req('/pacientes');
export const buscarPaciente     = (id)   => req(`/pacientes/${id}`);
export const cadastrarPaciente  = (body) => req('/pacientes', { method: 'POST', body: JSON.stringify(body) }, true);
export const removerPaciente    = (id)   => req(`/pacientes/${id}`, { method: 'DELETE' }, true);

// ── Médicos ───────────────────────────────────────────────────────────────────
export const listarMedicos      = ()     => req('/medicos');
export const cadastrarMedico    = (body) => req('/medicos', { method: 'POST', body: JSON.stringify(body) }, true);
export const rankingMedicos     = ()     => req('/medicos/ranking');

// ── Consultas ─────────────────────────────────────────────────────────────────
export const listarConsultas    = ()     => req('/consultas');
export const cadastrarConsulta  = (body) => req('/consultas', { method: 'POST', body: JSON.stringify(body) }, true);

// ── Internações ───────────────────────────────────────────────────────────────
export const listarInternacoes   = ()     => req('/internacoes');
export const cadastrarInternacao = (body) => req('/internacoes', { method: 'POST', body: JSON.stringify(body) }, true);

// ── Actuator ──────────────────────────────────────────────────────────────────
export const health = () => fetch('http://localhost:8090/actuator/health').then(r => r.json());
