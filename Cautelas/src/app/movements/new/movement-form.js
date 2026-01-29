'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MovementForm({ assets, people }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('OUT');

    // Multi-item state
    const [selectedAssets, setSelectedAssets] = useState([]); // Array of asset objects
    const [currentAssetId, setCurrentAssetId] = useState(''); // Current selection in dropdown

    const [isNewAsset, setIsNewAsset] = useState(false);
    const [newAssetData, setNewAssetData] = useState({ code: '', description: '' });

    const [isNewPerson, setIsNewPerson] = useState(false);
    const [newPersonData, setNewPersonData] = useState({ name: '', cpf: '', sector: '' });

    // Filter available assets based on type AND exclude already selected ones
    const filteredAssets = assets.filter(asset => {
        if (isNewAsset) return false;
        // Don't show if already in the cart
        if (selectedAssets.find(a => a.id === asset.id)) return false;

        if (type === 'OUT') return asset.status === 'AVAILABLE';
        if (type === 'IN') return asset.status === 'IN_USE';
        return true;
    });

    const addAssetToCart = (asset) => {
        if (!asset) return;
        setSelectedAssets([...selectedAssets, asset]);
        setCurrentAssetId(''); // Reset dropdown
    };

    const removeAssetFromCart = (assetId) => {
        setSelectedAssets(selectedAssets.filter(a => a.id !== assetId));
    };

    // Helper to add from dropdown
    const handleAddCurrent = () => {
        const asset = assets.find(a => a.id === parseInt(currentAssetId));
        if (asset) addAssetToCart(asset);
    };

    // Helper to add from new creation
    const handleAddNew = async () => {
        if (!newAssetData.code || !newAssetData.description) {
            alert('Preencha código e descrição');
            return;
        }
        setLoading(true);
        try {
            const assetRes = await fetch('/api/assets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAssetData)
            });
            if (!assetRes.ok) throw new Error((await assetRes.json()).error || 'Erro ao criar bem');

            const newAsset = await assetRes.json();
            // Add directly to cart
            setSelectedAssets([...selectedAssets, newAsset]);

            // Reset form
            setIsNewAsset(false);
            setNewAssetData({ code: '', description: '' });
        } catch (e) {
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchActive = async (term, personId) => {
        setLoading(true);
        try {
            let url = '/api/movements/active?';
            if (term) url += `term=${term}`;
            if (personId) url += `personId=${personId}`;

            const res = await fetch(url);
            if (!res.ok) throw new Error('Erro ao buscar itens');

            const movements = await res.json();

            if (movements.length === 0) {
                alert('Nenhum item em aberto encontrado com esses critérios.');
                setLoading(false);
                return;
            }

            // Validation: Check if found items belong to the same person as already selected items
            const newPersonId = movements[0].personId;
            const newPersonName = movements[0].person.name;

            // Find current person ID from the form (either via selected assets or current selection)
            // Ideally, we should check against the currently selected items' owner if any exists.

            // Let's assume the first item in selectedAssets (if any) defines the "Owner" of the current transaction.
            // We need to fetch the owner of items in selectedAssets.
            // PROBLEM: selectedAssets currently only stores Asset objects, not the Movement/Person info history.
            // SOLUTION: When adding from 'active', we should attach the personId to the asset object or rely on form state.

            // However, the simplest check is the Form's 'personId' field which acts as the 'Target Person'.
            const currentPersonSelect = document.querySelector('select[name="personId"]');
            const currentPersonId = currentPersonSelect ? parseInt(currentPersonSelect.value) : null;

            if (selectedAssets.length > 0 && currentPersonId && currentPersonId !== newPersonId) {
                const proceed = confirm(`Atenção: Os itens encontrados pertencem a ${newPersonName}, mas você já tem itens na lista para outra pessoa. \n\nDeseja LIMPAR a lista atual e usar apenas os novos itens de ${newPersonName}?`);
                if (!proceed) {
                    setLoading(false);
                    return;
                }
                // Clear list if user agrees
                setSelectedAssets([]);
            }

            // Extract unique assets
            const assetsFound = movements.map(m => m.asset);
            // Filter duplicates if already selected (though we might have just cleared)
            const newAssets = assetsFound.filter(a => !selectedAssets.find(sa => sa.id === a.id));

            if (newAssets.length === 0 && selectedAssets.length > 0) {
                // If we didn't clear and found duplicates
                alert('Os itens encontrados já estão na lista.');
            } else {
                if (selectedAssets.length > 0 && currentPersonId === newPersonId) {
                    // Adding more items from same person
                    setSelectedAssets([...selectedAssets, ...newAssets]);
                } else {
                    // New list (cleared or start)
                    setSelectedAssets(newAssets);
                }
            }

            // Auto-fill context from the FIRST movement found
            const examplar = movements[0];
            if (examplar) {
                setIsNewPerson(false);
                const personSelect = document.querySelector('select[name="personId"]');
                if (personSelect) personSelect.value = examplar.personId;

                const originInput = document.querySelector('input[name="originSector"]');
                const destInput = document.querySelector('input[name="destSector"]');

                // Swap sectors: Logic -> Inverse return
                if (originInput) originInput.value = examplar.destSector || '';
                if (destInput) destInput.value = examplar.originSector || '';
            }

        } catch (e) {
            console.error(e);
            alert('Erro ao buscar dados.');
        } finally {
            setLoading(false);
        }
    };

    async function handleSubmit(e) {
        e.preventDefault();
        if (selectedAssets.length === 0) {
            alert('Adicione pelo menos um bem à lista.');
            return;
        }

        setLoading(true);

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries()); // Get other fields like origin/dest/obs

        let finalPersonId = data.personId;

        try {
            // Logic to create new person if selected
            if (isNewPerson) {
                if (!newPersonData.name) {
                    throw new Error('Preencha o nome da nova pessoa.');
                }
                const personRes = await fetch('/api/people', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newPersonData)
                });
                if (!personRes.ok) throw new Error((await personRes.json()).error || 'Erro ao criar nova pessoa.');
                finalPersonId = (await personRes.json()).id;
            }

            const res = await fetch('/api/movements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    assetIds: selectedAssets.map(a => a.id), // Send array of IDs
                    personId: finalPersonId
                }),
            });

            if (!res.ok) {
                throw new Error('Falha ao criar movimentação');
            }

            const movement = await res.json();
            router.push(`/movements/${movement.id}/print`);
        } catch (err) {
            alert(err.message);
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>

            {/* Load from Term / Active Search Section */}
            {type === 'IN' && (
                <div className="card" style={{ marginBottom: '1.5rem', background: 'var(--gray-50)', border: '1px solid var(--gray-200)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <h3 className="text-lg font-bold" style={{ color: 'var(--gray-700)' }}>Carregar Itens de Cautela Anterior</h3>
                        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'var(--rf-gold)', color: 'white', borderRadius: '4px', fontWeight: 'bold' }}>Devolução</span>
                    </div>

                    <p className="text-muted text-sm" style={{ marginBottom: '1rem' }}>
                        Busque itens em aberto pelo número do termo ou pela pessoa responsável.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'end' }}>
                        <div>
                            <label className="form-label">Buscar por Termo</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    placeholder="Ex: 2026/0001"
                                    className="form-input"
                                    id="termSearchInput"
                                />
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={async () => {
                                        const term = document.getElementById('termSearchInput').value;
                                        if (!term) return alert('Digite o número do termo');
                                        await handleSearchActive(term, null);
                                    }}
                                >
                                    Buscar
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="form-label">Ou Buscar por Pessoa</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <select id="personSearchSelect" className="form-select">
                                    <option value="">Selecione...</option>
                                    {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={async () => {
                                        const pid = document.getElementById('personSearchSelect').value;
                                        if (!pid) return alert('Selecione uma pessoa');
                                        await handleSearchActive(null, pid);
                                    }}
                                >
                                    Buscar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="form-group">
                <label className="form-label">Tipo de Movimentação</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <label className="btn" style={{ flex: 1, border: '2px solid', borderColor: type === 'OUT' ? 'var(--rf-blue)' : 'var(--gray-300)', backgroundColor: type === 'OUT' ? 'var(--rf-blue)' : 'white', color: type === 'OUT' ? 'white' : 'var(--gray-600)', justifyContent: 'center' }}>
                        <input type="radio" name="type" value="OUT" checked={type === 'OUT'} onChange={(e) => { setType(e.target.value); setSelectedAssets([]); }} style={{ display: 'none' }} />
                        Retirada (Saída)
                    </label>
                    <label className="btn" style={{ flex: 1, border: '2px solid', borderColor: type === 'IN' ? 'var(--rf-gold)' : 'var(--gray-300)', backgroundColor: type === 'IN' ? 'var(--rf-gold)' : 'white', color: type === 'IN' ? 'white' : 'var(--gray-600)', justifyContent: 'center' }}>
                        <input type="radio" name="type" value="IN" checked={type === 'IN'} onChange={(e) => { setType(e.target.value); setSelectedAssets([]); }} style={{ display: 'none' }} />
                        Devolução (Entrada)
                    </label>
                </div>
            </div>

            {/* Asset Selection Section */}
            <div className="card" style={{ marginBottom: '1.5rem', border: '1px solid var(--rf-blue-light)' }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--rf-blue)' }}>Itens da Cautela ({selectedAssets.length})</h3>

                {selectedAssets.length > 0 ? (
                    <table style={{ width: '100%', marginBottom: '1rem' }}>
                        <thead>
                            <tr style={{ background: 'var(--gray-100)', textAlign: 'left', fontSize: '0.8rem' }}>
                                <th style={{ padding: '0.5rem' }}>Código</th>
                                <th style={{ padding: '0.5rem' }}>Descrição</th>
                                <th style={{ padding: '0.5rem', width: '50px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedAssets.map(asset => (
                                <tr key={asset.id} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                                    <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>{asset.code}</td>
                                    <td style={{ padding: '0.5rem' }}>{asset.description}</td>
                                    <td style={{ padding: '0.5rem' }}>
                                        <button type="button" onClick={() => removeAssetFromCart(asset.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-muted text-sm mb-4">Nenhum item selecionado.</p>
                )}

                <hr style={{ margin: '1rem 0', borderColor: 'var(--gray-200)' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'end' }}>
                    <div>
                        <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Adicionar Bem</span>
                            <button type="button" onClick={() => setIsNewAsset(!isNewAsset)} style={{ fontSize: '0.75rem', color: 'var(--rf-blue)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                                {isNewAsset ? 'Selecionar da lista' : 'Cadastrar novo/digitar?'}
                            </button>
                        </label>

                        {isNewAsset ? (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input placeholder="Código" value={newAssetData.code} onChange={(e) => setNewAssetData({ ...newAssetData, code: e.target.value })} className="form-input" style={{ width: '150px' }} />
                                <input placeholder="Descrição" value={newAssetData.description} onChange={(e) => setNewAssetData({ ...newAssetData, description: e.target.value })} className="form-input" style={{ flex: 1 }} />
                                <button type="button" onClick={handleAddNew} disabled={loading} className="btn btn-secondary">Add</button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <select value={currentAssetId} onChange={(e) => setCurrentAssetId(e.target.value)} className="form-select">
                                    <option value="">Selecione para adicionar...</option>
                                    {filteredAssets.map(asset => (
                                        <option key={asset.id} value={asset.id}>{asset.code} - {asset.description}</option>
                                    ))}
                                </select>
                                <button type="button" onClick={handleAddCurrent} disabled={!currentAssetId} className="btn btn-secondary">Add</button>
                            </div>
                        )}
                        {filteredAssets.length === 0 && !isNewAsset && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--status-error-text)', marginTop: '0.5rem' }}>
                                {type === 'OUT' ? 'Todos os bens disponíveis já foram selecionados ou não há bens.' : 'Nenhum bem em uso encontrado.'}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                    <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Responsável (Pessoa)</span>
                        <button type="button" onClick={() => setIsNewPerson(!isNewPerson)} style={{ fontSize: '0.75rem', color: 'var(--rf-blue)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                            {isNewPerson ? 'Selecionar existente' : 'Cadastrar novo?'}
                        </button>
                    </label>

                    {isNewPerson ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', border: '1px dashed var(--rf-blue)', borderRadius: 'var(--radius-md)', background: '#f0f9ff' }}>
                            <input placeholder="Nome Completo" value={newPersonData.name} onChange={(e) => setNewPersonData({ ...newPersonData, name: e.target.value })} className="form-input" />
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input placeholder="CPF (Opcional)" value={newPersonData.cpf} onChange={(e) => setNewPersonData({ ...newPersonData, cpf: e.target.value })} className="form-input" />
                                <input placeholder="Setor (Opcional)" value={newPersonData.sector} onChange={(e) => setNewPersonData({ ...newPersonData, sector: e.target.value })} className="form-input" />
                            </div>
                        </div>
                    ) : (
                        <select name="personId" required={!isNewPerson} className="form-select">
                            <option value="">Selecione uma pessoa...</option>
                            {people.map(person => (
                                <option key={person.id} value={person.id}>
                                    {person.name} {person.cpf ? `(${person.cpf})` : ''}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                    <label className="form-label">Setor de Origem</label>
                    <input name="originSector" placeholder="De onde veio?" required className="form-input" />
                </div>
                <div>
                    <label className="form-label">Setor de Destino</label>
                    <input name="destSector" placeholder="Para onde vai?" required className="form-input" />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Observações</label>
                <textarea
                    name="observation"
                    rows="3"
                    className="form-input"
                />
            </div>

            <div style={{ marginTop: '2rem' }}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }} disabled={loading || selectedAssets.length === 0}>
                    {loading ? 'Processando...' : `Gerar Termo com ${selectedAssets.length} item(ns)`}
                </button>
            </div>
        </form>
    );
}
