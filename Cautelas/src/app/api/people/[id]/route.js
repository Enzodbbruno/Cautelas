import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET single person
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const person = await prisma.person.findUnique({
            where: { id: parseInt(id) }
        });

        if (!person) {
            return NextResponse.json({ error: 'Person not found' }, { status: 404 });
        }

        return NextResponse.json(person);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch person' }, { status: 500 });
    }
}

// PUT (update) person
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, cpf, sector } = body;

        const person = await prisma.person.update({
            where: { id: parseInt(id) },
            data: {
                ...(name && { name }),
                ...(cpf !== undefined && { cpf }),
                ...(sector !== undefined && { sector })
            }
        });

        return NextResponse.json(person);
    } catch (error) {
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Person not found' }, { status: 404 });
        }
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'CPF already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to update person' }, { status: 500 });
    }
}

// DELETE person
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        // Check if person has movements
        const movementCount = await prisma.movement.count({
            where: { personId: parseInt(id) }
        });

        if (movementCount > 0) {
            return NextResponse.json({
                error: 'Cannot delete person with existing movements. Delete movements first.'
            }, { status: 400 });
        }

        await prisma.person.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ message: 'Person deleted successfully' });
    } catch (error) {
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Person not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete person' }, { status: 500 });
    }
}
