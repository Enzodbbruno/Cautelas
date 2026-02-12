import prisma from '@/lib/prisma';
import AssetsClient from './assets-client';

export const dynamic = 'force-dynamic';

async function getAssets() {
    const assets = await prisma.asset.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return assets;
}

export default async function AssetsPage() {
    const assets = await getAssets();

    return <AssetsClient initialAssets={assets} />;
}
