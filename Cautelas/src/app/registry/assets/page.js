import Link from 'next/link';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getAssets() {
    const assets = await prisma.asset.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return assets;
}

export default async function AssetsPage() {
    const assets = await getAssets();

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
                        </tr>
                    </thead>
                    <tbody>
                        {assets.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--pk-text-muted)' }}>
                                    Nenhum bem cadastrado. Clique em "Novo Bem" para começar.
                                </td>
                            </tr>
                        ) : (
                            assets.map((asset) => (
                                <tr key={asset.id}>
                                    <td style={{ fontWeight: '600', color: 'var(--rf-blue)' }}>{asset.code}</td>
                                    <td>{asset.description}</td>
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
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
