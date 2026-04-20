# Implementação do MCP Oracle para Deploy na Nuvem

**Data:** 17 de abril de 2026
**Status:** Planejado

## 1. Visão Geral

Este documento descreve a implementação do Oracle MCP (Model Context Protocol) para gerenciar a infraestrutura OCI (Oracle Cloud Infrastructure) do projeto de sistema de condomínio. O objetivo é utilizar o Oracle MCP para provisionar, monitorar e gerenciar recursos na nuvem OCI, mantendo o PostgreSQL em um container Docker na VM OCI.

## 2. Arquitetura Proposta

### 2.1 Componentes Principais

- **OCI Free Tier VM (Ampere A1):**
  - Ubuntu 22.04
  - 4 OCPUs, 24 GB RAM
  - 200 GB de armazenamento
  - Docker e Docker Compose instalados

- **Serviços Docker:**
  - `postgres`: Banco de dados PostgreSQL
  - `backend`: Aplicação NestJS
  - `web`: Frontend Next.js
  - `nginx`: Reverse proxy
  - `mcp-oracle`: Serviço MCP Oracle para gerenciamento de infraestrutura OCI

- **CI/CD:**
  - GitHub Actions para build e push de imagens Docker
  - GitHub Container Registry (GHCR) para armazenamento de imagens
  - Script `deploy.sh` para deploy na VM OCI

### 2.2 Fluxo de Deploy

1. **Build e Push:**
   - GitHub Actions constrói as imagens Docker para `backend` e `web`.
   - Imagens são enviadas para o GHCR.

2. **Deploy na VM OCI:**
   - Script `deploy.sh` é executado via SSH na VM OCI.
   - Docker Compose puxa as imagens do GHCR e sobe os serviços.

3. **Gerenciamento de Infraestrutura:**
   - Serviço `mcp-oracle` gerencia recursos OCI via Oracle MCP.
   - Backend NestJS consome o serviço `mcp-oracle` para operações de infraestrutura.

## 3. Implementação do Serviço `mcp-oracle`

### 3.1 Estrutura do Serviço

```
apps/mcp-oracle/
├── server.py                # Entrypoint FastMCP
├── pyproject.toml          # Dependências Python
├── uv.lock                 # Lock de dependências
├── Containerfile           # Dockerfile para build
├── tools/
│   ├── compute_tools.py    # Ferramentas para gerenciamento de instâncias
│   ├── network_tools.py    # Ferramentas para gerenciamento de rede
│   ├── storage_tools.py   # Ferramentas para gerenciamento de storage
│   └── identity_tools.py  # Ferramentas para gerenciamento de identidade
└── tests/
    ├── unit/               # Testes unitários
    └── e2e/                # Testes end-to-end
```

### 3.2 Configuração do Serviço

#### 3.2.1 Variáveis de Ambiente

- `OCI_CONFIG_PROFILE`: Perfil de configuração OCI.
- `OCI_CONFIG_FILE`: Caminho para o arquivo de configuração OCI.
- `ORACLE_MCP_HOST`: Host para o serviço MCP Oracle.
- `ORACLE_MCP_PORT`: Porta para o serviço MCP Oracle.
- `FASTMCP_LOG_LEVEL`: Nível de log para o FastMCP.
- `ORACLE_MCP_LOG_DIR`: Diretório de log para o MCP Oracle.
- `ORACLE_MCP_AUTH_TOKEN`: Token de autenticação para o MCP Oracle.

#### 3.2.2 Docker Compose

Adicionar o serviço `mcp-oracle` ao `docker-compose.yml`:

```yaml
services:
  mcp-oracle:
    build: apps/mcp-oracle
    env_file: .env
    ports:
      - "8080:8080"
    networks:
      - condominio_net
```

Adicionar override de produção no `docker-compose.prod.yml`:

```yaml
services:
  mcp-oracle:
    build: null
    image: ghcr.io/${GITHUB_REPOSITORY}/mcp-oracle:${IMAGE_TAG:-latest}
    restart: always
    volumes: []
    environment:
      NODE_ENV: production
      PORT: 8080
    ports: []
```

### 3.3 Ferramentas MCP Oracle

#### 3.3.1 Ferramentas de Computação (`compute_tools.py`)

- `compute_list`: Lista instâncias de computação.
- `compute_start`: Inicia uma instância de computação.
- `compute_stop`: Para uma instância de computação.

#### 3.3.2 Ferramentas de Rede (`network_tools.py`)

- `network_list_vcns`: Lista VCNs (Virtual Cloud Networks).
- `network_list_subnets`: Lista subnets.
- `network_list_security_lists`: Lista security lists.

#### 3.3.3 Ferramentas de Storage (`storage_tools.py`)

- `storage_list_namespaces`: Lista namespaces de Object Storage.
- `storage_list_buckets`: Lista buckets de Object Storage.

#### 3.3.4 Ferramentas de Identidade (`identity_tools.py`)

- `identity_list_compartments`: Lista compartments.
- `identity_list_regions`: Lista regiões disponíveis.

## 4. Integração com Backend NestJS

### 4.1 Módulo `OciMcpModule`

Criar um módulo no backend para consumir o serviço `mcp-oracle`:

```typescript
// apps/backend/src/oci-mcp/oci-mcp.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [OciMcpService],
  exports: [OciMcpService],
})
export class OciMcpModule {}
```

### 4.2 Serviço `OciMcpService`

Implementar o serviço para chamar as ferramentas MCP Oracle:

```typescript
// apps/backend/src/oci-mcp/oci-mcp.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OciMcpService {
  constructor(private readonly httpService: HttpService) {}

  async callTool(toolName: string, params: any): Promise<any> {
    const response = await firstValueFrom(
      this.httpService.post(`http://mcp-oracle:8080/mcp/tools/${toolName}`, params)
    );
    return response.data;
  }
}
```

### 4.3 Endpoint de API

Adicionar endpoint no backend para chamar as ferramentas MCP Oracle:

```typescript
// apps/backend/src/app.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { OciMcpService } from './oci-mcp/oci-mcp.service';
import { AuthGuard } from './auth/auth.guard';
import { Roles } from './auth/roles.decorator';
import { Role } from './auth/role.enum';

@Controller('api/oci')
@UseGuards(AuthGuard)
export class AppController {
  constructor(private readonly ociMcpService: OciMcpService) {}

  @Post('tools/:toolName')
  @Roles(Role.Admin)
  async callOciTool(@Body() params: any): Promise<any> {
    return this.ociMcpService.callTool(params.toolName, params);
  }
}
```

## 5. CI/CD com GitHub Actions

### 5.1 Workflow de Deploy

Criar o arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to OCI VM

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push backend image
        uses: docker/build-push-action@v5
        with:
          context: ./apps/backend
          push: true
          tags: ghcr.io/${{ github.repository }}/backend:latest

      - name: Build and push web image
        uses: docker/build-push-action@v5
        with:
          context: ./apps/web
          push: true
          tags: ghcr.io/${{ github.repository }}/web:latest

      - name: Build and push mcp-oracle image
        uses: docker/build-push-action@v5
        with:
          context: ./apps/mcp-oracle
          push: true
          tags: ghcr.io/${{ github.repository }}/mcp-oracle:latest

      - name: Deploy to OCI VM
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.OCI_VM_HOST }}
          username: ubuntu
          key: ${{ secrets.OCI_VM_SSH_KEY }}
          script: |
            cd /home/ubuntu/appcondominio-docker
            git pull origin main
            docker compose -f docker-compose.yml -f docker-compose.prod.yml pull
            docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 5.2 Secrets do GitHub

Configurar os seguintes secrets no repositório GitHub:

- `OCI_VM_HOST`: Endereço IP da VM OCI.
- `OCI_VM_SSH_KEY`: Chave SSH privada para acesso à VM OCI.
- `GITHUB_TOKEN`: Token de acesso ao GitHub Container Registry (já configurado automaticamente).

## 6. Configuração de Segredos e Hardening

### 6.1 Arquivo `.env.prod`

Criar o arquivo `.env.prod` na raiz do projeto:

```env
# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=condominio

# Backend
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/condominio

# MCP Oracle
OCI_CONFIG_PROFILE=DEFAULT
OCI_CONFIG_FILE=/home/ubuntu/.oci/config
ORACLE_MCP_HOST=0.0.0.0
ORACLE_MCP_PORT=8080
FASTMCP_LOG_LEVEL=INFO
ORACLE_MCP_LOG_DIR=/var/log/mcp-oracle
ORACLE_MCP_AUTH_TOKEN=seu_token_aqui
```

### 6.2 Configuração do Nginx

Adicionar bloco para o serviço `mcp-oracle` no `infra/nginx/conf.d/app.conf`:

```nginx
location /mcp {
  proxy_pass http://mcp-oracle:8080;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_set_header Authorization "Bearer ${ORACLE_MCP_AUTH_TOKEN}";
}
```

## 7. Verificação e Testes

### 7.1 Testes Locais

1. Subir os serviços localmente:
   ```bash
   docker compose up
   ```

2. Verificar se o serviço `mcp-oracle` está respondendo:
   ```bash
   curl http://localhost:8080/mcp
   ```

3. Testar uma ferramenta MCP Oracle:
   ```bash
   curl -X POST http://localhost:8080/mcp/tools/compute_list
   ```

### 7.2 Testes na VM OCI

1. Acessar a VM OCI via SSH:
   ```bash
   ssh ubuntu@<OCI_VM_HOST>
   ```

2. Verificar se os serviços estão rodando:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml ps
   ```

3. Verificar logs do serviço `mcp-oracle`:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml logs mcp-oracle
   ```

### 7.3 Testes de Integração

1. Acessar o endpoint de API do backend:
   ```bash
   curl -X POST https://seu-dominio.com/api/oci/tools/compute_list \
     -H "Authorization: Bearer <SEU_TOKEN>"
   ```

2. Verificar logs de auditoria no backend:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml logs backend
   ```

## 8. Próximos Passos

1. Criar a estrutura do serviço `mcp-oracle` no diretório `apps/mcp-oracle/`.
2. Implementar as ferramentas MCP Oracle para gerenciamento de infraestrutura OCI.
3. Configurar o CI/CD com GitHub Actions para build e deploy automático.
4. Testar localmente e na VM OCI.
5. Monitorar e ajustar conforme necessário.

## 9. Referências

- [Oracle MCP Documentation](https://docs.oracle.com/en/database/oracle/sql-developer-command-line/25.2/sqcug/using-oracle-sqlcl-mcp-server.html)
- [OCI Free Tier](https://www.oracle.com/cloud/free/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
