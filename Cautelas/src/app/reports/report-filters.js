'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ReportFilters({ people, assets, initialParams }) {
    // Check if the initial year is one of our predefined options (2024-2028)
    const predefinedYears = ['2024', '2025', '2026', '2027', '2028'];
    const initialYear = initialParams.year || new Date().getFullYear().toString();
    const isPredefined = predefinedYears.includes(initialYear);

    const [isCustomYear, setIsCustomYear] = useState(!isPredefined && initialParams.year);

    return (
        <div className="card" style={{ marginBottom: '2rem' }}>
            <form className="filter-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>

                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Pessoa</label>
                    <select name="personId" defaultValue={initialParams.personId} className="form-select">
                        <option value="">Todas</option>
                        {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Patrimônio</label>
                    <select name="assetId" defaultValue={initialParams.assetId} className="form-select">
                        <option value="">Todos</option>
                        {assets.map(a => <option key={a.id} value={a.id}>{a.code} - {a.description.substring(0, 20)}...</option>)}
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Nº Termo</label>
                    <input name="termNumber" type="number" placeholder="Ex: 123" defaultValue={initialParams.termNumber} className="form-input" />
                </div>

                <div>
                    <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                        <span>Ano</span>
                        <button
                            type="button"
                            onClick={() => setIsCustomYear(!isCustomYear)}
                            style={{ background: 'none', border: 'none', color: 'var(--rf-blue)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.75rem' }}
                        >
                            {isCustomYear ? 'Selecionar lista' : 'Digitar outro ano?'}
                        </button>
                    </label>

                    {isCustomYear ? (
                        <input
                            name="year"
                            type="number"
                            placeholder="Ex: 2023"
                            defaultValue={initialParams.year}
                            className="form-input"
                        />
                    ) : (
                        <select name="year" defaultValue={initialParams.year || new Date().getFullYear()} className="form-select">
                            <option value="">Todos</option>
                            {predefinedYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    )}
                </div>

                <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>Filtrar</button>
                <Link href="/reports" className="btn" style={{ height: '42px', border: '1px solid var(--border)', textAlign: 'center' }}>Limpar</Link>
            </form>
        </div>
    );
}
