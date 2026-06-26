import { useEffect, useState, useCallback } from 'react';
import { IconStethoscope } from '@tabler/icons-react';
import { listarMedicos, cadastrarMedico } from '../api';
import Modal from '../components/Modal';
import Toast from '../components/Toast';

const FORM_VAZIO = { nome: '', crm: '', especialidade: '' };

const ESPECIALIDADES = [
  'Cardiologista', 'Ortopedista', 'Neurologista', 'Pediatra',
  'Ginecologista', 'Dermatologista', 'Oncologista', 'Psiquiatra', 'Outra',
];

export default function Medicos() {
  const [medicos, setMedicos]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]           = useState(FORM_VAZIO);
  const [salvando, setSalvando]   = useState(false);
  const [toast, setToast]         = useState(null);

  const carregar = useCallback(() => {
    setLoading(true);
    listarMedicos()
      .then(setMedicos)
      .catch(() => setMedicos([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(carregar, [carregar]);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const fecharModal = () => { setModalOpen(false); setForm(FORM_VAZIO); };

  const onSubmit = async e => {
    e.preventDefault();
    setSalvando(true);
    try {
      await cadastrarMedico(form);
      fecharModal();
      carregar();
      setToast({ ok: true, text: 'Médico cadastrado com sucesso!' });
    } catch (err) {
      setToast({ ok: false, text: err.message });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Médicos</h1>

      <div className="card">
        <div className="card-title-row">
          <span>Lista de Médicos</span>
          <button className="btn btn-primary btn-sm btn-icon" onClick={() => setModalOpen(true)}>
            <IconStethoscope size={15} stroke={1.9} /> Novo Médico
          </button>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : medicos.length === 0 ? (
          <div className="loading">Nenhum médico cadastrado.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>CRM</th>
                <th>Especialidade</th>
              </tr>
            </thead>
            <tbody>
              {medicos.map(m => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.nome}</td>
                  <td><span className="badge badge-neutral">{m.crm}</span></td>
                  <td><span className="badge badge-blue">{m.especialidade}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modalOpen} onClose={fecharModal} title="Cadastrar Médico">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Nome</label>
            <input name="nome" value={form.nome} onChange={onChange} required autoFocus />
          </div>
          <div className="form-group">
            <label>CRM</label>
            <input name="crm" value={form.crm} onChange={onChange} required placeholder="CRM-12345/SP" />
          </div>
          <div className="form-group">
            <label>Especialidade</label>
            <select name="especialidade" value={form.especialidade} onChange={onChange} required>
              <option value="">Selecione...</option>
              {ESPECIALIDADES.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={fecharModal}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </Modal>

      <Toast msg={toast} onClose={() => setToast(null)} />
    </div>
  );
}
