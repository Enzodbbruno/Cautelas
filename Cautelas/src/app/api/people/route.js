import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const people = await prisma.person.findMany({
            orderBy: { name: 'asc' },
        });
        return NextResponse.json(people);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch people' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, cpf, sector } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // Handle empty CPF string - set to undefined so Prisma handles it properly 
        // and doesn't trigger unique constraint on empty strings
        const processedCpf = cpf && cpf.trim() !== '' ? cpf.trim() : undefined;

        const person = await prisma.person.create({
            data: {
                name,
                cpf: processedCpf,
                sector,
            },
        });

        return NextResponse.json(person, { status: 201 });
    } catch (error) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Já existe uma pessoa cadastrada com esse CPF/Matrícula' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to create person' }, { status: 500 });
    }
}
