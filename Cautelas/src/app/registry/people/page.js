import prisma from '@/lib/prisma';
import PeopleClient from './people-client';

export const dynamic = 'force-dynamic';

async function getPeople() {
    const people = await prisma.person.findMany({
        orderBy: { name: 'asc' },
    });
    return people;
}

export default async function PeoplePage() {
    const people = await getPeople();

    return <PeopleClient initialPeople={people} />;
}
