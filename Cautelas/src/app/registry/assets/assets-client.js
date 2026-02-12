'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AssetsClient({ initialAssets }) {
    const [assets, setAssets] = useState(initialAssets);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ code: '', description: '' });

    const handleDelete = async (id, code) => {
        const firstConfirm = confirm(`⚠️ ATENÇÃO!\n\nVocê está prestes a DELETAR o bem:\n"${code}"\n\nTem certeza?`);
        if (!firstConfirm) return;

        const secondConfirm = confirm(`🚨 CONFIRMAÇÃO FINAL!\n\nEsta ação é IRREVERSÍVEL!\n\nDeletar permanentemente o bem "${code}"?`);
        if (!secondConfirm) return;

        try {
            const res = await fetch(`/api/assets/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (!res.ok) {
                alert(`Erro: ${data.error}`);
                return;
            }

            setAssets(assets.filter(a => a.id !== id));
            alert('✅ Bem deletado com sucesso!');
        } catch (error) {
            alert('Erro ao deletar bem.');
        }
    };

    const startEdit = (asset) => {
        setEditingId(asset.id);
        setEditData({ code: asset.code, description: asset.description });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditData({ code: '', description: '' });
    };

    const saveEdit = async (id) => {
        try {
            const res = await fetch(`/api/assets/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData)
            });

            const data = await res.json();

            if (!res.ok) {
                alert(`Erro: ${data.error}`);
                return;
            }

            setAssets(assets.map(a => a.id === id ? data : a));
            setEditingId(null);
            alert('✅ Bem atualizado com sucesso!');
        } catch (error) {
            alert('Erro ao atualizar bem.');
        }
    };

    return (
        <div className="container">
            <div className="page-header">
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--rf-blue)' }}>Gerenciar Bens</h2>
                    <p className="text-muted" style={{ marginTop: '0.25rem' }}>Cadastro de Patrimônio</p>
                </div>
                <div>
                    <Link href="/" className="btn btn-secondary" style={{ marginRight: '1rem' }}>
                        &larr; Voltar
                    </Link>
                    <Link href="/registry/assets/new" className="btn btn-primary">
                        + Novo Bem
                    </Link>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Patrimônio</th>
                            <th>Descrição</th>
                            <th>Status</th>
                            <th>Data Cadastro</th>
                            <th style={{ width: '180px' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assets.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--pk-text-muted)' }}>
                                    Nenhum bem cadastrado. Clique em "Novo Bem" para começar.
                                </td>
                            </tr>
                        ) : (
                            assets.map((asset) => (
                                <tr key={asset.id}>
                                    <td style={{ fontWeight: '600', color: 'var(--rf-blue)' }}>
                                        {editingId === asset.id ? (
                                            <input
                                                className="form-input"
                                                value={editData.code}
                                                onChange={(e) => setEditData({ ...editData, code: e.target.value })}
                                                style={{ width: '120px', padding: '0.25rem 0.5rem' }}
                                            />
                                        ) : (
                                            asset.code
                                        )}
                                    </td>
                                    <td>
                                        {editingId === asset.id ? (
                                            <input
                                                className="form-input"
                                                value={editData.description}
                                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                                style={{ width: '100%', padding: '0.25rem 0.5rem' }}
                                            />
                                        ) : (
                                            asset.description
                                        )}
                                    </td>
                                    <td>
                                        <span
                                            style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                fontWeight: '700',
                                                textTransform: 'uppercase',
                                                backgroundColor: asset.status === 'AVAILABLE' ? 'var(--status-success-bg)' : 'var(--status-error-bg)',
                                                color: asset.status === 'AVAILABLE' ? 'var(--status-success-text)' : 'var(--status-error-text)',
                                            }}
                                        >
                                            {asset.status === 'AVAILABLE' ? 'Disponível' : 'Em Uso'}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.875rem', color: 'var(--pk-text-muted)' }}>
                                        {new Date(asset.createdAt).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td>
                                        {editingId === asset.id ? (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => saveEdit(asset.id)}
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
                                                    onClick={() => startEdit(asset)}
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                                                >
                                                    ✏️ Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(asset.id, asset.code)}
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
