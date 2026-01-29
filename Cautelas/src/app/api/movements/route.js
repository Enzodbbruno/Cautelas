import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            type, // 'OUT' or 'IN'
            assetId, // Keep for backward compatibility/single item
            assetIds, // New array support
            personId,
            originSector,
            destSector,
            observation
        } = body;

        // Normalize assets to an array
        let finalAssetIds = [];
        if (assetIds && Array.isArray(assetIds)) {
            finalAssetIds = assetIds;
        } else if (assetId) {
            finalAssetIds = [assetId];
        }

        if (!type || finalAssetIds.length === 0 || !personId) {
            return NextResponse.json({ error: 'Missing required fields (type, assets, or person)' }, { status: 400 });
        }

        const currentYear = new Date().getFullYear();

        // Use interactive transaction to ensure consistency
        const result = await prisma.$transaction(async (tx) => {
            // 1. Get next term number for this year
            const lastMovement = await tx.movement.findFirst({
                where: { termYear: currentYear },
                orderBy: { termNumber: 'desc' },
            });

            const nextTermNumber = (lastMovement?.termNumber || 0) + 1;
            const createdMovements = [];

            // 2. Loop through all assets and create movements
            for (const id of finalAssetIds) {
                const numericId = parseInt(id);

                // Create the movement
                const movement = await tx.movement.create({
                    data: {
                        type,
                        assetId: numericId,
                        personId: parseInt(personId),
                        termNumber: nextTermNumber,
                        termYear: currentYear,
                        originSector,
                        destSector,
                        observation,
                        isActive: true, // This is the latest movement
                    },
                });
                createdMovements.push(movement);

                // 3. Update Asset Status 
                await tx.asset.update({
                    where: { id: numericId },
                    data: {
                        status: type === 'OUT' ? 'IN_USE' : 'AVAILABLE'
                    }
                });

                // 4. Update previous movements for this asset
                await tx.movement.updateMany({
                    where: {
                        assetId: numericId,
                        id: { not: movement.id }
                    },
                    data: { isActive: false }
                });
            }

            // Return the first movement just to have an ID for redirect, 
            // the print page will look up by termNumber anyway or we can just use this ID.
            return createdMovements[0];
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create movement' }, { status: 500 });
    }
}
