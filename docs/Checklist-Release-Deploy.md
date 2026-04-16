# Checklist de Release e Deploy

Checklist operacional para garantir releases previsiveis, seguras e rastreaveis no projeto AppCondominio.

## 1. Escopo e Controle de Versao

- [ ] Branch principal atualizada e sem conflitos.
- [ ] Mudancas do release mapeadas e revisadas.
- [ ] Changelog interno do release preenchido.
- [ ] Tag de versao definida (quando aplicavel).

## 2. Qualidade de Codigo

- [ ] Lint do frontend sem erros.
- [ ] Build do frontend concluido com sucesso.
- [ ] Build do backend concluido com sucesso.
- [ ] Endpoints criticos validados manualmente.
- [ ] Revisao tecnica concluida (codigo e arquitetura).

## 3. Ambiente e Seguranca

- [ ] Arquivo .env de producao revisado (sem placeholders).
- [ ] Segredos conferidos no GitHub Actions (VPS_HOST, VPS_USER, VPS_SSH_KEY).
- [ ] Token de acesso ao GHCR validado.
- [ ] Politica de acesso minimo aplicada para segredos e servidores.

## 4. Docker e Imagens

- [ ] Dockerfiles de web e backend atualizados e buildando.
- [ ] Imagens publicadas no GHCR com tag latest e SHA.
- [ ] Variaveis GITHUB_REPOSITORY e IMAGE_TAG validadas no deploy.
- [ ] Compose de producao validado: docker-compose.yml + docker-compose.prod.yml.

## 5. Infraestrutura de Producao

- [ ] Nginx com rotas e proxy revisados.
- [ ] Certificados SSL validos e renovacao automatica ativa.
- [ ] Banco PostgreSQL com backup confirmado antes do deploy.
- [ ] Espaco em disco da VPS conferido.

## 6. Execucao de Deploy

Sequencia recomendada:

1. Push para a branch main.
2. Acompanhar workflow em .github/workflows/deploy.yml.
3. Confirmar build e push das imagens no GHCR.
4. Confirmar etapa de deploy SSH sem falhas.
5. Validar status dos containers na VPS.

## 7. Validacao Pos-Deploy

- [ ] Frontend responde no dominio esperado.
- [ ] Endpoint de health do backend responde com status ok.
- [ ] Fluxos essenciais validados: login, navegacao principal e API.
- [ ] Logs de erro revisados em web, backend e nginx.
- [ ] Metricas basicas de CPU, memoria e disco dentro do esperado.

## 8. Plano de Rollback

- [ ] Tag SHA anterior identificada e registrada.
- [ ] Procedimento de rollback conhecido pela equipe responsavel.
- [ ] Comando de retorno para imagem anterior validado em ambiente seguro.
- [ ] Comunicacao de incidente definida (quem aciona, quem aprova).

## 9. Evidencias e Auditoria

- [ ] Link da execucao do workflow anexado no registro da release.
- [ ] Hash do commit/versao armazenado.
- [ ] Decisoes tecnicas e riscos residuais documentados.

## Comandos uteis

Na raiz do repositorio:

```bash
npm run lint
npm run build --prefix apps/web
npm run dev:local
npm run dev:local:down
npm run prod:up
npm run prod:down
```

Validacao de containers em producao:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps
```
