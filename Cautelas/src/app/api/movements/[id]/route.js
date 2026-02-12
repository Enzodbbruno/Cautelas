import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// DELETE movement (and entire term if needed)
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const url = new URL(request.url);
        const deleteTerm = url.searchParams.get('deleteTerm') === 'true';

        // Get the movement to find its term
        const movement = await prisma.movement.findUnique({
            where: { id: parseInt(id) }
        });

        if (!movement) {
            return NextResponse.json({ error: 'Movement not found' }, { status: 404 });
        }

        if (deleteTerm) {
            // Delete all movements with same term
            const deleted = await prisma.movement.deleteMany({
                where: {
                    termYear: movement.termYear,
                    termNumber: movement.termNumber
                }
            });

            // Update asset statuses back to AVAILABLE
            const affectedAssets = await prisma.movement.findMany({
                where: {
                    termYear: movement.termYear,
                    termNumber: movement.termNumber
                },
                select: { assetId: true }
            });

            for (const { assetId } of affectedAssets) {
                await prisma.asset.update({
                    where: { id: assetId },
                    data: { status: 'AVAILABLE' }
                });
            }

            return NextResponse.json({
                message: `Term ${movement.termYear}/${movement.termNumber} deleted successfully`,
                count: deleted.count
            });
        } else {
            // Delete single movement
            await prisma.movement.delete({
                where: { id: parseInt(id) }
            });

            // Update asset status
            const latestMovement = await prisma.movement.findFirst({
                where: { assetId: movement.assetId },
                orderBy: { createdAt: 'desc' }
            });

            await prisma.asset.update({
                where: { id: movement.assetId },
                data: {
                    status: latestMovement
                        ? (latestMovement.type === 'OUT' ? 'IN_USE' : 'AVAILABLE')
                        : 'AVAILABLE'
                }
            });

            return NextResponse.json({ message: 'Movement deleted successfully' });
        }
    } catch (error) {
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Movement not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete movement' }, { status: 500 });
    }
}
