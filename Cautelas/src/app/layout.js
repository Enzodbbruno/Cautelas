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
              <div style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center' }}>
                {/* Logo da Receita Federal (SVG Inline) */}
                <svg viewBox="0 0 512 512" fill="white" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                  <path d="M125.7 160L96 211.3H155.3L125.7 160ZM125.7 48L36.3 203H42.7L125.7 346.7L208.7 203H215L125.7 48Z" />
                  <path d="M386.3 160L356.7 211.3H416L386.3 160ZM386.3 48L297 203H303.3L386.3 346.7L469.3 203H475.7L386.3 48Z" />
                  <path d="M256 168.7L213.3 242.3H298.7L256 168.7ZM256 56.7L153.7 233.7H160L256 400L352 233.7H358.3L256 56.7Z" />
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', lineHeight: '1.2', margin: 0 }}>Receita Federal</h1>
                <p style={{ fontSize: '0.8rem', opacity: 0.9, margin: 0 }}>Sistema de Gestão de Cautelas</p>
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
