import Link from 'next/link';

export const dynamic = 'force-dynamic';

function IconBox() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
  );
}

function IconUsers() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
  );
}

function IconFileText() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
  );
}

function IconPlus() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
  );
}

export default function Home() {
  return (
    <div className="container">

      <div className="mb-8" style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--pk-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--rf-blue)' }}>Bem-vindo ao Sistema de Gestão</h2>
          <p className="text-muted">Selecione uma ação abaixo para começar.</p>
        </div>
        <div style={{ opacity: 0.1 }}>
          <div className="logo-icon" style={{ width: '64px', height: '64px', fontSize: '2rem' }}>RF</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

        {/* Nova Movimentação - Primary Action */}
        <Link href="/movements/new" className="card card-hover" style={{ borderLeft: '5px solid var(--rf-blue)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--rf-blue)', borderRadius: '0.5rem', color: 'white' }}>
              <IconPlus />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--rf-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ação Rápida</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Nova Cautela</h3>
          <p className="text-muted text-sm mb-4">Registrar retirada ou devolução de bens e gerar termo.</p>
          <div style={{ color: 'var(--rf-blue)', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Iniciar Processo &rarr;
          </div>
        </Link>

        {/* Relatórios */}
        <Link href="/reports" className="card card-hover" style={{ borderLeft: '5px solid var(--rf-gold)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--rf-gold)', borderRadius: '0.5rem', color: 'white' }}>
              <IconFileText />
            </div>
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Relatórios e Histórico</h3>
          <p className="text-muted text-sm mb-4">Consulte movimentações passadas e filtre por data ou pessoa.</p>
          <div style={{ color: 'var(--rf-gold-hover)', fontWeight: '600', fontSize: '0.9rem' }}>
            Visualizar &rarr;
          </div>
        </Link>

        {/* Gestão de Bens */}
        <Link href="/registry/assets" className="card card-hover">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--gray-100)', borderRadius: '0.5rem', color: 'var(--gray-600)' }}>
              <IconBox />
            </div>
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Bens / Patrimônio</h3>
          <p className="text-muted text-sm mb-4">Gerencie o inventário de bens disponíveis.</p>
        </Link>

        {/* Gestão de Pessoas */}
        <Link href="/registry/people" className="card card-hover">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--gray-100)', borderRadius: '0.5rem', color: 'var(--gray-600)' }}>
              <IconUsers />
            </div>
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Pessoas</h3>
          <p className="text-muted text-sm mb-4">Gerencie o cadastro de servidores.</p>
        </Link>

      </div>
    </div>
  );
}
