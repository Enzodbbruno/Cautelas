import Link from 'next/link';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getPeople() {
    const people = await prisma.person.findMany({
        orderBy: { name: 'asc' },
    });
    return people;
}

export default async function PeoplePage() {
    const people = await getPeople();

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
                        </tr>
                    </thead>
                    <tbody>
                        {people.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
                                    Nenhuma pessoa cadastrada.
                                </td>
                            </tr>
                        ) : (
                            people.map((person) => (
                                <tr key={person.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem', fontWeight: '500' }}>{person.name}</td>
                                    <td style={{ padding: '1rem' }}>{person.cpf || '-'}</td>
                                    <td style={{ padding: '1rem' }}>{person.sector || '-'}</td>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                                        {new Date(person.createdAt).toLocaleDateString('pt-BR')}
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
