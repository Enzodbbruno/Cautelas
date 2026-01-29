import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Fetch all distinct active termNumbers/Years
        const activeMovements = await prisma.movement.findMany({
            where: {
                type: 'OUT',
                isActive: true
            },
            select: {
                termYear: true,
                termNumber: true,
                person: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                termNumber: 'desc'
            }
        });

        // Dedup and map
        const termsMap = new Map();

        activeMovements.forEach(m => {
            const key = `${m.termYear}/${m.termNumber}`;
            if (!termsMap.has(key)) {
                termsMap.set(key, {
                    year: m.termYear,
                    number: m.termNumber,
                    label: `${m.termYear}/${String(m.termNumber).padStart(4, '0')}`,
                    personName: m.person.name // Just for context, implies who has the term
                });
            }
        });

        const terms = Array.from(termsMap.values());

        return NextResponse.json(terms);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch active terms' }, { status: 500 });
    }
}
