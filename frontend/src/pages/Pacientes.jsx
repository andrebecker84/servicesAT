import { useEffect, useState, useCallback } from 'react';
import { IconUserPlus, IconTrash } from '@tabler/icons-react';
import { listarPacientes, cadastrarPaciente, removerPaciente } from '../api';
import Modal from '../components/Modal';
import Toast from '../components/Toast';

const FORM_VAZIO = { nome: '', cpf: '', dataNascimento: '', telefone: '' };

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]           = useState(FORM_VAZIO);
  const [salvando, setSalvando]   = useState(false);
  const [toast, setToast]         = useState(null);

  const carregar = useCallback(() => {
    setLoading(true);
    listarPacientes()
      .then(setPacientes)
      .catch(() => setPacientes([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(carregar, [carregar]);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const fecharModal = () => { setModalOpen(false); setForm(FORM_VAZIO); };

  const onSubmit = async e => {
    e.preventDefault();
    setSalvando(true);
    try {
      await cadastrarPaciente(form);
      fecharModal();
      carregar();
      setToast({ ok: true, text: 'Paciente cadastrado com sucesso!' });
    } catch (err) {
      setToast({ ok: false, text: err.message });
    } finally {
      setSalvando(false);
    }
  };

  const onRemover = async (id, nome) => {
    if (!confirm(`Remover o paciente "${nome}"?`)) return;
    try {
      await removerPaciente(id);
      carregar();
      setToast({ ok: true, text: 'Paciente removido.' });
    } catch (err) {
      setToast({ ok: false, text: err.message });
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Pacientes</h1>

      <div className="card">
        <div className="card-title-row">
          <span>Lista de Pacientes</span>
          <button className="btn btn-primary btn-sm btn-icon" onClick={() => setModalOpen(true)}>
            <IconUserPlus size={15} stroke={1.9} /> Novo Paciente
          </button>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : pacientes.length === 0 ? (
          <div className="loading">Nenhum paciente cadastrado.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>CPF</th>
                <th>Nascimento</th>
                <th>Telefone</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nome}</td>
                  <td><span className="badge badge-neutral">{p.cpf}</span></td>
                  <td>{p.dataNascimento}</td>
                  <td>{p.telefone}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm btn-icon"
                      onClick={() => onRemover(p.id, p.nome)}
                    >
                      <IconTrash size={14} stroke={1.9} /> Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modalOpen} onClose={fecharModal} title="Cadastrar Paciente">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Nome</label>
            <input name="nome" value={form.nome} onChange={onChange} required autoFocus />
          </div>
          <div className="form-group">
            <label>CPF (apenas números)</label>
            <input name="cpf" value={form.cpf} onChange={onChange} required maxLength={11} placeholder="12345678901" />
          </div>
          <div className="form-group">
            <label>Data de Nascimento</label>
            <input name="dataNascimento" type="date" value={form.dataNascimento} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Telefone</label>
            <input name="telefone" value={form.telefone} onChange={onChange} placeholder="(11) 91234-5678" />
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
