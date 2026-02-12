'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ReportsClient({ initialMovements }) {
    const [movements, setMovements] = useState(initialMovements);

    const handleDeleteTerm = async (movement) => {
        const termLabel = `${movement.termYear}/${movement.termNumber}`;
        const firstConfirm = confirm(
            `⚠️ ATENÇÃO!\n\nVocê está prestes a DELETAR TODO O TERMO:\n"${termLabel}"\n\nIsso irá remover TODAS as movimentações deste termo.\n\nTem certeza?`
        );
        if (!firstConfirm) return;

        const secondConfirm = confirm(
            `🚨 CONFIRMAÇÃO FINAL!\n\nEsta ação é IRREVERSÍVEL!\n\nDeletar permanentemente o termo "${termLabel}" e todas suas movimentações?`
        );
        if (!secondConfirm) return;

        try {
            const res = await fetch(`/api/movements/${movement.id}?deleteTerm=true`, {
                method: 'DELETE'
            });
            const data = await res.json();

            if (!res.ok) {
                alert(`Erro: ${data.error}`);
                return;
            }

            // Remove all movements with same term from UI
            setMovements(movements.filter(m =>
                !(m.termYear === movement.termYear && m.termNumber === movement.termNumber)
            ));

            alert(`✅ Termo ${termLabel} deletado com sucesso! (${data.count} movimentações removidas)`);
        } catch (error) {
            alert('Erro ao deletar termo.');
        }
    };

    const handleDeleteSingle = async (movement) => {
        const firstConfirm = confirm(
            `⚠️ ATENÇÃO!\n\nVocê está prestes a DELETAR esta movimentação:\nBem: ${movement.asset.code}\nPessoa: ${movement.person.name}\n\nTem certeza?`
        );
        if (!firstConfirm) return;

        const secondConfirm = confirm(
            `🚨 CONFIRMAÇÃO FINAL!\n\nEsta ação é IRREVERSÍVEL!\n\nDeletar permanentemente esta movimentação?`
        );
        if (!secondConfirm) return;

        try {
            const res = await fetch(`/api/movements/${movement.id}`, {
                method: 'DELETE'
            });
            const data = await res.json();

            if (!res.ok) {
                alert(`Erro: ${data.error}`);
                return;
            }

            setMovements(movements.filter(m => m.id !== movement.id));
            alert('✅ Movimentação deletada com sucesso!');
        } catch (error) {
            alert('Erro ao deletar movimentação.');
        }
    };

    // Group movements by term for better visualization
    const groupedByTerm = movements.reduce((acc, m) => {
        const key = `${m.termYear}/${m.termNumber}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(m);
        return acc;
    }, {});

    return (
        <div className="card">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                        <th style={{ padding: '0.75rem' }}>Termo</th>
                        <th style={{ padding: '0.75rem' }}>Data</th>
                        <th style={{ padding: '0.75rem' }}>Tipo</th>
                        <th style={{ padding: '0.75rem' }}>Bem</th>
                        <th style={{ padding: '0.75rem' }}>Pessoa</th>
                        <th style={{ padding: '0.75rem' }}>Origem &gt; Destino</th>
                        <th style={{ padding: '0.75rem', width: '200px' }}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {movements.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={{ padding: '2rem', textAlign: 'center' }}>
                                Nenhum registro encontrado.
                            </td>
                        </tr>
                    ) : (
                        Object.entries(groupedByTerm).map(([termKey, termMovements]) => (
                            termMovements.map((m, idx) => (
                                <tr
                                    key={m.id}
                                    style={{
                                        borderBottom: '1px solid var(--border)',
                                        backgroundColor: m.isActive ? 'transparent' : '#f9fafb',
                                        opacity: m.isActive ? 1 : 0.7
                                    }}
                                >
                                    <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>
                                        {m.termYear}/{m.termNumber}
                                        {idx === 0 && termMovements.length > 1 && (
                                            <span style={{
                                                marginLeft: '0.5rem',
                                                fontSize: '0.7rem',
                                                color: 'var(--gray-600)',
                                                backgroundColor: 'var(--gray-200)',
                                                padding: '0.1rem 0.4rem',
                                                borderRadius: '4px'
                                            }}>
                                                {termMovements.length} itens
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                                        {new Date(m.movementDate).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <span style={{
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            backgroundColor: m.type === 'OUT' ? '#fee2e2' : '#dcfce7',
                                            color: m.type === 'OUT' ? '#991b1b' : '#166534'
                                        }}>
                                            {m.type === 'OUT' ? 'Saída' : 'Entrada'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{m.asset.code}</td>
                                    <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{m.person.name}</td>
                                    <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                                        {m.originSector} &gt; {m.destSector}
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            <Link
                                                href={`/movements/${m.id}/print`}
                                                className="btn btn-secondary"
                                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                            >
                                                📄 Ver
                                            </Link>
                                            {idx === 0 && (
                                                <button
                                                    onClick={() => handleDeleteTerm(m)}
                                                    className="btn"
                                                    style={{
                                                        padding: '0.25rem 0.5rem',
                                                        fontSize: '0.75rem',
                                                        backgroundColor: '#dc2626',
                                                        color: 'white',
                                                        border: 'none'
                                                    }}
                                                    title="Deletar termo completo"
                                                >
                                                    🗑️ Termo
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteSingle(m)}
                                                className="btn btn-outline"
                                                style={{
                                                    padding: '0.25rem 0.5rem',
                                                    fontSize: '0.75rem',
                                                    color: '#dc2626',
                                                    borderColor: '#dc2626'
                                                }}
                                                title="Deletar apenas este item"
                                            >
                                                ✖️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
