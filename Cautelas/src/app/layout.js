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
            <div className="logo-group">
              <div className="logo-icon">
                <span>RF</span>
              </div>
              <div className="brand-text">
                <h1>Receita Federal</h1>
                <span>Gestão de Cautelas</span>
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
