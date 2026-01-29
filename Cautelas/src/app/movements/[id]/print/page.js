import prisma from '@/lib/prisma';
import Link from 'next/link';
import PrintButton from './print-button';

export const dynamic = 'force-dynamic';

export default async function PrintPage({ params }) {
    // Await params as per Next.js App Router requirement
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    // 1. Fetch the initial movement to get the Term Number
    const initialMovement = await prisma.movement.findUnique({
        where: { id },
    });

    if (!initialMovement) return <div>Termo não encontrado</div>;

    // 2. Fetch ALL movements with this Term Number and Year
    const movements = await prisma.movement.findMany({
        where: {
            termNumber: initialMovement.termNumber,
            termYear: initialMovement.termYear
        },
        include: {
            asset: true,
            person: true
        }
    });

    const primaryMvt = movements[0]; // Use the first one for common data (Person, Dates, Sectors)
    const termTitle = primaryMvt.type === 'OUT' ? 'TERMO DE ENTREGA E RESPONSABILIDADE' : 'TERMO DE DEVOLUÇÃO DE BENS';
    const termNumberFull = `${primaryMvt.termYear}/${primaryMvt.termNumber.toString().padStart(4, '0')}`;

    return (
        <div className="print-container">
            {/* Screen Interface - Valid until printed */}
            <div className="no-print container" style={{ marginBottom: '2rem' }}>
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <h2 style={{ marginBottom: '1rem', color: 'var(--success)' }}>Movimentação Registrada com Sucesso!</h2>
                    <p style={{ marginBottom: '2rem' }}>Termo <strong>{termNumberFull}</strong> com <strong>{movements.length}</strong> item(ns) pronto para impressão.</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link href="/" className="btn" style={{ border: '1px solid var(--border)' }}>Voltar ao Início</Link>
                        <PrintButton />
                    </div>
                </div>
            </div>

            {/* Print Interface */}
            <div className="paper">
                <header className="doc-header">
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Ministério da Fazenda</h1>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Secretaria da Receita Federal do Brasil</h2>
                        <div style={{ width: '100px', height: '1px', background: 'black', margin: '0.5rem auto' }}></div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginTop: '1rem' }}>{termTitle}</h3>
                        <p style={{ marginTop: '0.5rem' }}>Nº {termNumberFull}</p>
                    </div>
                </header>

                <main className="doc-content" style={{ lineHeight: '1.6', textAlign: 'justify' }}>
                    <p style={{ marginBottom: '1.5rem' }}>
                        Pelo presente termo, a unidade <strong>{primaryMvt.originSector}</strong>,
                        {primaryMvt.type === 'OUT' ? ' entrega ' : ' recebe de volta '}
                        ao servidor(a) abaixo identificado, o(s) bem(ns) patrimonial(is) descrito(s) a seguir:
                    </p>

                    <table className="doc-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                        <thead>
                            <tr style={{ background: '#f0f0f0' }}>
                                <th style={{ border: '1px solid black', padding: '0.5rem', fontWeight: 'bold', width: '20%' }}>Patrimônio</th>
                                <th style={{ border: '1px solid black', padding: '0.5rem', fontWeight: 'bold' }}>Descrição</th>
                                <th style={{ border: '1px solid black', padding: '0.5rem', fontWeight: 'bold', width: '20%' }}>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movements.map((m) => (
                                <tr key={m.id}>
                                    <td style={{ border: '1px solid black', padding: '0.5rem', textAlign: 'center' }}>{m.asset.code}</td>
                                    <td style={{ border: '1px solid black', padding: '0.5rem' }}>{m.asset.description}</td>
                                    <td style={{ border: '1px solid black', padding: '0.5rem', textAlign: 'center' }}>Bom</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {primaryMvt.observation && (
                        <div style={{ marginBottom: '2rem', border: '1px solid black', padding: '1rem' }}>
                            <p><strong>Observações:</strong> {primaryMvt.observation}</p>
                        </div>
                    )}

                    <div style={{ marginBottom: '2rem' }}>
                        <p><strong>Dados do Servidor:</strong></p>
                        <p>Nome: {primaryMvt.person.name}</p>
                        <p>CPF/Matrícula: {primaryMvt.person.cpf || 'Não informado'}</p>
                        <p>Setor de Lotação: {primaryMvt.person.sector || 'Não informado'}</p>
                    </div>

                    <p style={{ marginBottom: '3rem' }}>
                        {primaryMvt.type === 'OUT'
                            ? 'Declaro ter recebido o(s) material(is) acima discriminado(s) em perfeitas condições de uso e conservação, assumindo total responsabilidade pela sua guarda e zelo.'
                            : 'Declaro ter devolvido o(s) material(is) acima discriminado(s) nas condições em que se encontra(m).'}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4rem', gap: '2rem' }}>
                        <div style={{ flex: 1, textAlign: 'center', borderTop: '1px solid black', paddingTop: '0.5rem' }}>
                            <p>Responsável pela Entrega</p>
                            <p style={{ fontSize: '0.8rem' }}>(Gestão de Patrimônio)</p>
                        </div>
                        <div style={{ flex: 1, textAlign: 'center', borderTop: '1px solid black', paddingTop: '0.5rem' }}>
                            <p>{primaryMvt.person.name}</p>
                            <p style={{ fontSize: '0.8rem' }}>Servidor Responsável</p>
                        </div>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.8rem' }}>
                        Data: {new Date(primaryMvt.movementDate).toLocaleDateString('pt-BR')}
                    </p>
                </main>
            </div>
        </div>
    );
}
