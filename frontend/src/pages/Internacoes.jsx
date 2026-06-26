import { useEffect, useState, useCallback } from 'react';
import { IconBedFilled } from '@tabler/icons-react';
import { listarPacientes, listarInternacoes, cadastrarInternacao } from '../api';
import Modal from '../components/Modal';
import Toast from '../components/Toast';

const FORM_VAZIO = { dataEntrada: '', dataAlta: '', quarto: '', pacienteId: '' };

const fmtData = d => d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') : null;

export default function Internacoes() {
  const [internacoes, setInternacoes] = useState([]);
  const [pacientes, setPacientes]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [form, setForm]             = useState(FORM_VAZIO);
  const [salvando, setSalvando]     = useState(false);
  const [toast, setToast]           = useState(null);

  const carregar = useCallback(() => {
    setLoading(true);
    listarInternacoes().then(setInternacoes).catch(() => setInternacoes([])).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    carregar();
    listarPacientes().then(setPacientes).catch(() => setPacientes([]));
  }, [carregar]);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const fecharModal = () => { setModalOpen(false); setForm(FORM_VAZIO); };

  const onSubmit = async e => {
    e.preventDefault();
    setSalvando(true);
    try {
      await cadastrarInternacao({
        ...form,
        pacienteId: Number(form.pacienteId),
        dataAlta: form.dataAlta || null,
      });
      fecharModal();
      carregar();
      setToast({ ok: true, text: 'Internação registrada com sucesso!' });
    } catch (err) {
      setToast({ ok: false, text: err.message });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Internações</h1>

      <div className="card">
        <div className="card-title-row">
          <span>Internações registradas</span>
          <button className="btn btn-primary btn-sm btn-icon" onClick={() => setModalOpen(true)}>
            <IconBedFilled size={15} stroke={1.9} /> Nova Internação
          </button>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : internacoes.length === 0 ? (
          <div className="loading">Nenhuma internação registrada.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Paciente</th>
                <th>Quarto</th>
                <th>Entrada</th>
                <th>Alta</th>
              </tr>
            </thead>
            <tbody>
              {internacoes.map(i => (
                <tr key={i.id}>
                  <td>{i.id}</td>
                  <td>{i.nomePaciente}</td>
                  <td><span className="badge badge-blue">{i.quarto}</span></td>
                  <td>{fmtData(i.dataEntrada)}</td>
                  <td>{i.dataAlta ? fmtData(i.dataAlta) : <span className="badge badge-green">Internado</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modalOpen} onClose={fecharModal} title="Registrar Internação">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Paciente</label>
            <select name="pacienteId" value={form.pacienteId} onChange={onChange} required autoFocus>
              <option value="">Selecione...</option>
              {pacientes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Quarto</label>
            <input name="quarto" value={form.quarto} onChange={onChange} required placeholder="Ex: 201-A" />
          </div>
          <div className="form-group">
            <label>Data de Entrada</label>
            <input name="dataEntrada" type="date" value={form.dataEntrada} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Data de Alta (opcional)</label>
            <input name="dataAlta" type="date" value={form.dataAlta} onChange={onChange} />
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
