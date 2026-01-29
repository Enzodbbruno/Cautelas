# Sistema de Gestão de Cautelas - Receita Federal

Sistema para controle de patrimônio e emissão de termos de responsabilidade.
Desenvolvido com Next.js, Prisma e Postgres/SQLite.

## Como Rodar Localmente

1.  Instale as dependências:
    ```powershell
    npm install
    ```

2.  Crie o banco de dados local (SQLite):
    ```powershell
    npx prisma migrate dev --name init
    ```

3.  Inicie o servidor de desenvolvimento:
    ```powershell
    npm run dev
    ```

4.  Acesse `http://localhost:3000`.

## Deploy (GitHub + Vercel)

Para publicar no Vercel e manter os dados salvos:

1.  **GitHub**:
    - Crie um repositório no GitHub.
    - Faça o push deste código.

2.  **Vercel**:
    - Importe o projeto do GitHub no Vercel.
    - Na aba **Storage**, crie um Banco de Dados **Vercel Postgres**.
    - Conecte o banco ao projeto.
    - O Vercel irá configurar as variáveis de ambiente (`POSTGRES_PRISMA_URL` etc) automaticamente.

3.  **Ajuste Importante**:
    - O arquivo `prisma/schema.prisma` está configurado para `provider = "sqlite"` para uso local.
    - Para produção (Postgres/Vercel), você precisará alterar para:
      ```prisma
      datasource db {
        provider = "postgresql"
      }
      ```
    - Você pode ajustar isso antes de subir ou usar variáveis de ambiente para controlar.

## Funcionalidades

- **Dashboard**: Acesso rápido.
- **Bens**: Cadastro de patrimônio.
- **Pessoas**: Cadastro de servidores.
- **Cautelas**: Retirada e Devolução com numeração sequencial anual.
- **Impressão**: Termos de responsabilidade formatados para assinatura.
- **Relatórios**: Histórico completo com filtros.
