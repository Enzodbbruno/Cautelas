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

        // Check for duplicate code
        const existingAsset = await prisma.asset.findUnique({
            where: { code: code.trim() }
        });

        if (existingAsset) {
            return NextResponse.json({
                error: `Já existe um bem cadastrado com o código "${code}". Cada patrimônio deve ter um código único.`
            }, { status: 409 });
        }

        const asset = await prisma.asset.create({
            data: {
                code: code.trim(),
                description: description.trim(),
                status: 'AVAILABLE',
            },
        });

        return NextResponse.json(asset, { status: 201 });
    } catch (error) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Código de patrimônio já existe no sistema.' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to create asset' }, { status: 500 });
    }
}
