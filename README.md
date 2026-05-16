# Programação Full Stack - Trabalho 1
## Introdução
Esse projeto implementa um sistema simples de e-shop com autenticação com JWT. Usa-se TypeORM para lidar com os bancos de dados de ambiente de teste e desenvolvimento que são em sqlite e PostgresQL, respectivamente.

---

## Pré-configuração

1 - Crie um arquivo .env no diretório raiz do projeto
'''
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=test
DB_TYPE=postgres

# Application
NODE_ENV=development

token_secret=your_secret
'''
2 - Crie um banco de dados no Postgres/sqlite
