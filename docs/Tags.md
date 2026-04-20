# 🏷️ Tags — Versionamento e Releases

Este documento define a política de versionamento e tagging do repositório **AppCondominio**.

---

## 📌 Política de Versionamento

Utiliza-se **versionamento semântico (SemVer)** com o formato:

```
MAJOR.MINOR.PATCH
     │     │     └── Correção de bugs
     │     └──────── Nova funcionalidade (compatível)
     └────────────── Mudança incompatível (breaking change)
```

**Exemplo**: `v1.2.3` → Major `1`, Minor `2`, Patch `3`

---

## 🏷️ Estrutura de Tags

### Formato de Tags

```
v<MAJOR>.<MINOR>.<PATCH>
```

**Exemplos**:
- `v0.1.0` — Primeira versão funcional
- `v0.2.0` — Novas funcionalidades
- `v1.0.0` — Primeira release de produção
- `v1.1.0` — Novas funcionalidades向后兼容

### Tag de Ambiente

Para ambientes específicos, utiliza-se suffix:

```
v<VERSION>-<AMBIENT>
```

| Sufixo   | Significado              | Exemplo           |
|----------|--------------------------|-------------------|
| `-dev`   | Ambiente de desenvolvimento | `v1.0.0-dev`    |
| `-staging` | Ambiente de homologação  | `v1.0.0-staging` |
| `-prod`  | Ambiente de produção     | `v1.0.0-prod`     |

---

## 🔄 Ciclo de Releases

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌────────────┐
│  feature/*  │───▶│  develop     │───▶│  release/*  │───▶│   main     │
└─────────────┘    └──────────────┘    └─────────────┘    └─────┬──────┘
                                                                │
                                                        ┌───────▼───────┐
                                                        │  Tag + Release │
                                                        │  GitHub       │
                                                        └───────────────┘
```

### Branches

| Branch       | Propósito                                    |
|-------------|----------------------------------------------|
| `main`      | Código em produção                          |
| `develop`   | Integração de features e preparação de release |
| `feature/*` | Desenvolvimento de novas funcionalidades     |
| `release/*` | Preparação de release (testes, fixes menores) |
| `hotfix/*`  | Correções críticas em produção               |

---

## 📋 Comandos Git — Tags

### Criar uma tag

```bash
# Tag leve ( lightweight )
git tag v1.0.0

# Tag anotada ( com mensagem )
git tag -a v1.0.0 -m "Release v1.0.0 - Primeira versão de produção"

# Tag com assinatura GPG
git tag -s v1.0.0 -m "Release v1.0.0 - Primeira versão de produção"
```

### Listar tags

```bash
# Todas as tags
git tag

# Tags com informações
git tag -l -n

# Tags por padrão
git tag -l "v1.*"
```

###推送 tags

```bash
# Push de uma tag específica
git push origin v1.0.0

# Push de todas as tags
git push --tags
```

### Deletar tags

```bash
# Local
git tag -d v1.0.0

# Remota
git push origin --delete v1.0.0
```

---

## 📦 Releases GitHub

Cada release no GitHub deve incluir:

1. **Título**: `v<VERSION> — <TÍTULO DESCRITIVO>`
2. **Tag**: Selecionar tag correspondente
3. **Descrição**: Changelog formatado
4. **Assets**: Binários e imagens (se aplicável)

### Template de Changelog

```markdown
## 🐛 Correções
- Correção: Descrição da correção (#issue)

## ✨ Novas Funcionalidades
- Feature: Descrição da nova funcionalidade (#issue)

## 🔧 Melhorias
- Improvement: Descrição da melhoria (#issue)

## ⚠️ Breaking Changes
- **BREAKING**: Descrição da mudança incompatível
```

---

## ✅ Checklist de Release

- [ ] Todos os testes passando
- [ ] Pipeline CI/CD verde
- [ ] Changlog atualizado
- [ ] Tag criada com versão correta
- [ ] Release draft criada no GitHub
- [ ] Aprovação técnica validada
- [ ] Documentação atualizada
- [ ] Nota de release publicada

---

## 📊 Tags Atuais do Repositório

| Tag        | Data       | Descrição                    |
|------------|------------|------------------------------|
| `v0.1.0`   | 2026-01-XX | Baseline inicial             |
| `v0.2.0`   | 2026-03-XX | Funcionalidades de portaria  |
| `v1.0.0`   | 2026-04-16 | Primeira release de produção |

---

## 🔗 Referências

- [SemVer.org](https://semver.org/) — Especificação oficial
- [Keep a Changelog](https://keepachangelog.com/) — Formato de changelog
- [GitHub Releases](https://docs.github.com/pt/repositories/releasing-projects-on-github/about-releases)
