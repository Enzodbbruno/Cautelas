import prisma from '@/lib/prisma';
import ReportFilters from './report-filters';
import ReportsClient from './reports-client';

export const dynamic = 'force-dynamic';

async function getMovements(searchParams) {
    const { personId, assetId, termNumber, year } = searchParams;

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
    const resolvedSearchParams = await searchParams;
    const movements = await getMovements(resolvedSearchParams);
    const { people, assets } = await getOptions();

    return (
        <div className="container">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Relatório de Movimentações</h2>

            {/* Filter Form - Client Component */}
            <ReportFilters people={people} assets={assets} initialParams={resolvedSearchParams} />

            <ReportsClient initialMovements={movements} />
        </div>
    );
}
