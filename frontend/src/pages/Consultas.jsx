import { useEffect, useState, useCallback } from 'react';
import { IconCalendarPlus } from '@tabler/icons-react';
import { listarPacientes, listarMedicos, listarConsultas, cadastrarConsulta } from '../api';
import Modal from '../components/Modal';
import Toast from '../components/Toast';

const FORM_VAZIO = { data: '', hora: '', observacoes: '', pacienteId: '', medicoId: '' };

const fmtData = iso => new Date(iso).toLocaleString('pt-BR', {
  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

export default function Consultas() {
  const [consultas, setConsultas]   = useState([]);
  const [pacientes, setPacientes]   = useState([]);
  const [medicos, setMedicos]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [form, setForm]             = useState(FORM_VAZIO);
  const [salvando, setSalvando]     = useState(false);
  const [toast, setToast]           = useState(null);

  const carregar = useCallback(() => {
    setLoading(true);
    listarConsultas().then(setConsultas).catch(() => setConsultas([])).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    carregar();
    listarPacientes().then(setPacientes).catch(() => setPacientes([]));
    listarMedicos().then(setMedicos).catch(() => setMedicos([]));
  }, [carregar]);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const fecharModal = () => { setModalOpen(false); setForm(FORM_VAZIO); };

  const onSubmit = async e => {
    e.preventDefault();
    setSalvando(true);
    try {
      await cadastrarConsulta({
        dataConsulta: `${form.data}T${form.hora}`,
        observacoes: form.observacoes,
        pacienteId: Number(form.pacienteId),
        medicoId: Number(form.medicoId),
      });
      fecharModal();
      carregar();
      setToast({ ok: true, text: 'Consulta cadastrada com sucesso!' });
    } catch (err) {
      setToast({ ok: false, text: err.message });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Consultas</h1>

      <div className="card">
        <div className="card-title-row">
          <span>Consultas registradas</span>
          <button className="btn btn-primary btn-sm btn-icon" onClick={() => setModalOpen(true)}>
            <IconCalendarPlus size={15} stroke={1.9} /> Nova Consulta
          </button>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : consultas.length === 0 ? (
          <div className="loading">Nenhuma consulta registrada.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Data</th>
                <th>Paciente</th>
                <th>Médico</th>
                <th>Especialidade</th>
                <th>Observações</th>
              </tr>
            </thead>
            <tbody>
              {consultas.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{fmtData(c.dataConsulta)}</td>
                  <td>{c.nomePaciente}</td>
                  <td>{c.nomeMedico}</td>
                  <td><span className="badge badge-blue">{c.especialidadeMedico}</span></td>
                  <td>{c.observacoes || '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modalOpen} onClose={fecharModal} title="Registrar Consulta">
        <form onSubmit={onSubmit}>
          <div className="inline-form">
            <div className="form-group">
              <label>Data</label>
              <input name="data" type="date" value={form.data} onChange={onChange} required autoFocus />
            </div>
            <div className="form-group">
              <label>Hora</label>
              <input name="hora" type="time" value={form.hora} onChange={onChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Paciente</label>
            <select name="pacienteId" value={form.pacienteId} onChange={onChange} required>
              <option value="">Selecione...</option>
              {pacientes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Médico</label>
            <select name="medicoId" value={form.medicoId} onChange={onChange} required>
              <option value="">Selecione...</option>
              {medicos.map(m => <option key={m.id} value={m.id}>{m.nome} ({m.especialidade})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Observações</label>
            <textarea name="observacoes" value={form.observacoes} onChange={onChange} placeholder="Diagnóstico, prescrições..." />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={fecharModal}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </Modal>

      <Toast msg={toast} onClose={() => setToast(null)} />
    </div>
  );
}
