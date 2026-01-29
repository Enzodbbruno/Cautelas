import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term'); // Expected format "2026/0001" or just "1"
    const personId = searchParams.get('personId');

    if (!term && !personId) {
        return NextResponse.json({ error: 'Term or Person ID required' }, { status: 400 });
    }

    const where = {
        isActive: true, // Only items currently out
        type: 'OUT'
    };

    if (personId) {
        where.personId = parseInt(personId);
    }

    if (term) {
        if (term.includes('/')) {
            const [year, number] = term.split('/');
            where.termYear = parseInt(year);
            where.termNumber = parseInt(number);
        } else {
            // Assume current year if only number provided, or maybe just search number exact?
            // Safer to search exact termNumber/Year combination but if user types "1", what do they mean?
            // Let's assume they might type just the number for the *current* year, or we search strictly.
            // Let's try to find matches for the number in any year if ambiguous? No, usually current year.
            // Let's implement strict Term/Year parsing or Number only (Current Year assumption).

            const num = parseInt(term);
            if (!isNaN(num)) {
                where.termNumber = num;
                // Optional: restrict to current year? Let's leave it open to find potentially old terms still active.
                // Actually, term numbers reset every year, so "1" exists in 2024, 2025, 2026.
                // If we don't filter by year, we might get multiple results.
                // Let's default to current year if not specified.
                where.termYear = new Date().getFullYear();
            }
        }
    }

    try {
        const movements = await prisma.movement.findMany({
            where,
            include: {
                asset: true,
                person: true
            },
            orderBy: {
                movementDate: 'desc'
            }
        });

        // We want to return the ASSETS primarily, but maybe with context?
        // Let's return the full movement + asset info so frontend can map it.
        return NextResponse.json(movements);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch active movements' }, { status: 500 });
    }
}
