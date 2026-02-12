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
            // Get all movements with same term BEFORE deleting
            const affectedMovements = await prisma.movement.findMany({
                where: {
                    termYear: movement.termYear,
                    termNumber: movement.termNumber
                },
                select: { assetId: true, type: true }
            });

            // Delete all movements with same term
            const deleted = await prisma.movement.deleteMany({
                where: {
                    termYear: movement.termYear,
                    termNumber: movement.termNumber
                }
            });

            // Update asset statuses
            for (const mov of affectedMovements) {
                // Check if there are any other active movements for this asset
                const remainingMovements = await prisma.movement.findMany({
                    where: { assetId: mov.assetId },
                    orderBy: { createdAt: 'desc' },
                    take: 1
                });

                // If no remaining movements, set to AVAILABLE
                // Otherwise, set based on the last movement type
                const newStatus = remainingMovements.length === 0
                    ? 'AVAILABLE'
                    : (remainingMovements[0].type === 'OUT' ? 'IN_USE' : 'AVAILABLE');

                await prisma.asset.update({
                    where: { id: mov.assetId },
                    data: { status: newStatus }
                });
            }

            return NextResponse.json({
                message: `Term ${movement.termYear}/${movement.termNumber} deleted successfully`,
                count: deleted.count
            });
        } else {
            // Delete single movement
            const assetId = movement.assetId;

            await prisma.movement.delete({
                where: { id: parseInt(id) }
            });

            // Update asset status based on remaining movements
            const latestMovement = await prisma.movement.findFirst({
                where: { assetId: assetId },
                orderBy: { createdAt: 'desc' }
            });

            await prisma.asset.update({
                where: { id: assetId },
                data: {
                    status: latestMovement
                        ? (latestMovement.type === 'OUT' ? 'IN_USE' : 'AVAILABLE')
                        : 'AVAILABLE'
                }
            });

            return NextResponse.json({ message: 'Movement deleted successfully' });
        }
    } catch (error) {
        console.error('Delete error:', error);
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Movement not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete movement' }, { status: 500 });
    }
}
