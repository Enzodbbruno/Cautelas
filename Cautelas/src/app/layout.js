import './globals.css';

export const metadata = {
  title: 'Sistema de Cautelas - Receita Federal',
  description: 'Gestão de Patrimônio e Cautelas',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <header className="main-header">
          <div className="container header-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* User provided logo image */}
              <img
                src="/logo-rf.png"
                alt="Receita Federal"
                style={{
                  height: '60px',
                  objectFit: 'contain'
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '0.5rem', borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
                <p style={{ fontSize: '0.9rem', opacity: 1, margin: 0, fontWeight: '500' }}>Sistema de Gestão de Cautelas</p>
              </div>
            </div>
            <a href="/" className="btn btn-secondary no-print" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              &larr; Menu
            </a>
          </div>
        </header>

        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
