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
              <div style={{ width: '40px', height: '40px', position: 'relative' }}>
                {/* Logo da Receita Federal (SVG) - Filter applied to make it white */}
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b3/Logo_Receita_Federal_do_Brasil.svg"
                  alt="Receita Federal"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: 'brightness(0) invert(1)'
                  }}
                />
              </div>
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', lineHeight: '1.2' }}>Receita Federal</h1>
                <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Sistema de Gestão de Cautelas</p>
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
