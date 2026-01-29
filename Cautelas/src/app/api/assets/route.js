import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const assets = await prisma.asset.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(assets);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { code, description } = body;

        if (!code || !description) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const asset = await prisma.asset.create({
            data: {
                code,
                description,
                status: 'AVAILABLE',
            },
        });

        return NextResponse.json(asset, { status: 201 });
    } catch (error) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Asset with this code already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to create asset' }, { status: 500 });
    }
}
