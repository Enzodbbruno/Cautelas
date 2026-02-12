import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET single asset
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const asset = await prisma.asset.findUnique({
            where: { id: parseInt(id) }
        });

        if (!asset) {
            return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
        }

        return NextResponse.json(asset);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch asset' }, { status: 500 });
    }
}

// PUT (update) asset
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { code, description, status } = body;

        const asset = await prisma.asset.update({
            where: { id: parseInt(id) },
            data: {
                ...(code && { code }),
                ...(description && { description }),
                ...(status && { status })
            }
        });

        return NextResponse.json(asset);
    } catch (error) {
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
        }
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Asset code already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to update asset' }, { status: 500 });
    }
}

// DELETE asset
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        // Check if asset has movements
        const movementCount = await prisma.movement.count({
            where: { assetId: parseInt(id) }
        });

        if (movementCount > 0) {
            return NextResponse.json({
                error: 'Cannot delete asset with existing movements. Delete movements first.'
            }, { status: 400 });
        }

        await prisma.asset.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ message: 'Asset deleted successfully' });
    } catch (error) {
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 });
    }
}
