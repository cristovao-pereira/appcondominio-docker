-- Habilita extensões necessárias para o sistema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";       -- geração de UUIDs
CREATE EXTENSION IF NOT EXISTS "pg_trgm";         -- busca por similaridade de texto
CREATE EXTENSION IF NOT EXISTS "btree_gin";       -- índices compostos GIN

-- Ajuste de timezone
SET timezone = 'America/Sao_Paulo';

-- Esquema principal (as migrations do NestJS/TypeORM criarão as tabelas)
-- Este script apenas garante as extensões e configurações de base.
