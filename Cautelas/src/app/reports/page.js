import Link from 'next/link';
import prisma from '@/lib/prisma';
import ReportFilters from './report-filters';

export const dynamic = 'force-dynamic';

async function getMovements(searchParams) {
    const { personId, assetId, termNumber, year } = await searchParams;

    const where = {};

    if (personId) where.personId = parseInt(personId);
    if (assetId) where.assetId = parseInt(assetId);
    if (termNumber) where.termNumber = parseInt(termNumber);

    if (year) {
        const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
        const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);
        where.movementDate = {
            gte: startOfYear,
            lte: endOfYear
        };
    }

    const movements = await prisma.movement.findMany({
        where,
        include: {
            asset: true,
            person: true,
        },
        orderBy: { movementDate: 'desc' },
        take: 50, // Limit results for performance
    });

    return movements;
}

async function getOptions() {
    const [people, assets] = await Promise.all([
        prisma.person.findMany({ orderBy: { name: 'asc' } }),
        prisma.asset.findMany({ orderBy: { code: 'asc' } }),
    ]);
    return { people, assets };
}

export default async function ReportsPage({ searchParams }) {
    const movements = await getMovements(searchParams);
    const { people, assets } = await getOptions();

    return (
        <div className="container">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Relatório de Movimentações</h2>

            {/* Filter Form - Client Component */}
            <ReportFilters people={people} assets={assets} initialParams={searchParams} />

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
                            <th style={{ padding: '0.75rem' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movements.length === 0 ? (
                            <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center' }}>Nenhum registro encontrado.</td></tr>
                        ) : (
                            movements.map(m => (
                                <tr key={m.id} style={{ borderBottom: '1px solid var(--border)', backgroundColor: m.isActive ? 'transparent' : '#f9fafb', opacity: m.isActive ? 1 : 0.7 }}>
                                    <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{m.termYear}/{m.termNumber}</td>
                                    <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{new Date(m.movementDate).toLocaleDateString('pt-BR')}</td>
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
                                    <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{m.originSector} &gt; {m.destSector}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <Link href={`/movements/${m.id}/print`} className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', border: '1px solid var(--border)' }}>
                                            Ver Termo
                                        </Link>
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
