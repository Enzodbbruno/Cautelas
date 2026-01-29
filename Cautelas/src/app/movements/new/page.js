import prisma from '@/lib/prisma';
import MovementForm from './movement-form';

export const dynamic = 'force-dynamic';

async function getData() {
    const [assets, people] = await Promise.all([
        prisma.asset.findMany({ orderBy: { code: 'asc' } }),
        prisma.person.findMany({ orderBy: { name: 'asc' } })
    ]);
    return { assets, people };
}

export default async function NewMovementPage() {
    const { assets, people } = await getData();

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Nova Movimentação</h2>
            <div className="card">
                <MovementForm assets={assets} people={people} />
            </div>
        </div>
    );
}
