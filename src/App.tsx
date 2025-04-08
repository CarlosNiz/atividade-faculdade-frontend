import React, { useEffect, useState, FormEvent } from 'react';
import './App.css';

const API_URL = 'http://localhost:8080/tarefa';

interface Tarefa {
  id: number;
  descricao: string;
  concluido: boolean;
}

function App() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [descricao, setDescricao] = useState<string>('');
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    listarTarefas();
  }, []);

  const listarTarefas = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (Array.isArray(data)) {
        setTarefas(data);
      } else {
        console.error('Resposta da API não é um array:', data);
      }
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  const adicionarOuAtualizarTarefa = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API_URL}/${editId}` : API_URL;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ descricao, concluido: false })
    });

    setDescricao('');
    setEditId(null);
    listarTarefas();
  };

  const editarTarefa = (tarefa: Tarefa) => {
    setDescricao(tarefa.descricao);
    setEditId(tarefa.id);
  };

  const excluirTarefa = async (id: number) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    listarTarefas();
  };

  const alternarConclusao = async (tarefa: Tarefa) => {
    await fetch(`${API_URL}/${tarefa.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ descricao: tarefa.descricao, concluido: !tarefa.concluido })
    });
    listarTarefas();
  };

  return (
    <div className="app-container">
      <h1>Lista de Tarefas</h1>

      <form onSubmit={adicionarOuAtualizarTarefa}>
        <input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição da tarefa"
          required
        />
        <button type="submit">{editId ? 'Atualizar' : 'Adicionar'}</button>
      </form>

      <ul>
        {tarefas.map((tarefa) => (
          <li key={tarefa.id} className={tarefa.concluido ? 'concluida' : ''}>
            <input
              type="checkbox"
              checked={tarefa.concluido}
              onChange={() => alternarConclusao(tarefa)}
            />
            <span>{tarefa.descricao}</span>
            <button onClick={() => editarTarefa(tarefa)}>Editar</button>
            <button onClick={() => excluirTarefa(tarefa.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
