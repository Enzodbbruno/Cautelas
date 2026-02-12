'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PeopleClient({ initialPeople }) {
    const [people, setPeople] = useState(initialPeople);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ name: '', cpf: '', sector: '' });

    const handleDelete = async (id, name) => {
        const firstConfirm = confirm(`⚠️ ATENÇÃO!\n\nVocê está prestes a DELETAR a pessoa:\n"${name}"\n\nTem certeza?`);
        if (!firstConfirm) return;

        const secondConfirm = confirm(`🚨 CONFIRMAÇÃO FINAL!\n\nEsta ação é IRREVERSÍVEL!\n\nDeletar permanentemente "${name}"?`);
        if (!secondConfirm) return;

        try {
            const res = await fetch(`/api/people/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (!res.ok) {
                alert(`Erro: ${data.error}`);
                return;
            }

            setPeople(people.filter(p => p.id !== id));
            alert('✅ Pessoa deletada com sucesso!');
        } catch (error) {
            alert('Erro ao deletar pessoa.');
        }
    };

    const startEdit = (person) => {
        setEditingId(person.id);
        setEditData({ name: person.name, cpf: person.cpf || '', sector: person.sector || '' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditData({ name: '', cpf: '', sector: '' });
    };

    const saveEdit = async (id) => {
        try {
            const res = await fetch(`/api/people/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData)
            });

            const data = await res.json();

            if (!res.ok) {
                alert(`Erro: ${data.error}`);
                return;
            }

            setPeople(people.map(p => p.id === id ? data : p));
            setEditingId(null);
            alert('✅ Pessoa atualizada com sucesso!');
        } catch (error) {
            alert('Erro ao atualizar pessoa.');
        }
    };

    return (
        <div className="container">
            <div className="header-content" style={{ marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Gerenciar Pessoas</h2>
                    <p className="subtitle">Cadastre funcionários habilitados a realizar retiradas.</p>
                </div>
                <Link href="/registry/people/new" className="btn btn-primary">
                    + Nova Pessoa
                </Link>
            </div>

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem', color: 'var(--muted)' }}>Nome</th>
                            <th style={{ padding: '1rem', color: 'var(--muted)' }}>CPF/Matrícula</th>
                            <th style={{ padding: '1rem', color: 'var(--muted)' }}>Setor</th>
                            <th style={{ padding: '1rem', color: 'var(--muted)' }}>Data Cadastro</th>
                            <th style={{ padding: '1rem', color: 'var(--muted)', width: '180px' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {people.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
                                    Nenhuma pessoa cadastrada.
                                </td>
                            </tr>
                        ) : (
                            people.map((person) => (
                                <tr key={person.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem', fontWeight: '500' }}>
                                        {editingId === person.id ? (
                                            <input
                                                className="form-input"
                                                value={editData.name}
                                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                style={{ width: '100%', padding: '0.25rem 0.5rem' }}
                                            />
                                        ) : (
                                            person.name
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {editingId === person.id ? (
                                            <input
                                                className="form-input"
                                                value={editData.cpf}
                                                onChange={(e) => setEditData({ ...editData, cpf: e.target.value })}
                                                style={{ width: '100%', padding: '0.25rem 0.5rem' }}
                                            />
                                        ) : (
                                            person.cpf || '-'
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {editingId === person.id ? (
                                            <input
                                                className="form-input"
                                                value={editData.sector}
                                                onChange={(e) => setEditData({ ...editData, sector: e.target.value })}
                                                style={{ width: '100%', padding: '0.25rem 0.5rem' }}
                                            />
                                        ) : (
                                            person.sector || '-'
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                                        {new Date(person.createdAt).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {editingId === person.id ? (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => saveEdit(person.id)}
                                                    className="btn btn-success"
                                                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                                                >
                                                    Salvar
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="btn btn-outline"
                                                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => startEdit(person)}
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                                                >
                                                    ✏️ Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(person.id, person.name)}
                                                    className="btn"
                                                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', backgroundColor: '#dc2626', color: 'white' }}
                                                >
                                                    🗑️ Deletar
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
