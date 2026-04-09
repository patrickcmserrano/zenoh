# Roadmap de Implementação

## Fase 0 — MVP: Validação da Hipótese Central

**Objetivo:** Provar a hipótese mais diferenciada do projeto — *contradição baseada em histórico persistente* — antes de construir qualquer infraestrutura de consolidação.

**Critério de sucesso:** Zeno contradiz o usuário em 3 cenários reais com referência ao EventID correto, sem falsos positivos.

```
MVP Zeno v0.0.1:
├── Datomic Free rodando local (Docker)
│   └── Schema mínimo: event-id, actor, assertion, confidence, domain
├── Ingestão de mensagem → extração de FactNode via Ollama (1 chamada local)
├── Qdrant local — indexar FactNodes por embedding
├── Coherence Processor básico:
│   ├── top-3 retrieval por similaridade semântica
│   └── LLM Checker binário (Ollama + modelo 3B)
└── Se dissonância: injetar dissonance-flag e responder com postura "Alter"
```

**Stack mínima:**
- Clojure + Ring (HTTP)
- Datomic Free (Docker)
- Qdrant (Docker)
- Ollama (local)

**O que NÃO está no MVP:** Dream Worker, Engine de Saliência, NATS JetStream, Redis, Groq API, Constituição formal. Tudo isso vem depois — só depois da hipótese central estar validada.

---

## Fase 1 — O Tronco Cerebral (Core Completo)

Após o MVP validar a contradição, expandir para a infraestrutura de produção.

- [ ] Datomic em produção com queries bitemporais (`:db/as-of`, `:db/history`)
- [ ] NATS JetStream como event bus — desacoplar ingestão do processamento
- [ ] Redis Stack (RedisJSON + RediSearch) como Working Memory da sessão
- [ ] Groq API integrada como LLM principal de produção
- [ ] Constituição v1 derivada do [Protocolo de Interrogatório Constitucional](../../co-creation/invite-prompt.md)

---

## Fase 2 — O Hipocampo (Consolidação)

- [ ] Dream Worker com Temporal.io — ver [dream-worker.md](../architecture/dream-worker.md)
- [ ] Engine de Saliência: cálculo de `M(t) = S₀·e^(-λt) + V` com V emergente do grafo
- [ ] Qdrant em produção com payload filtering por `Domain` e `Confidence`
- [ ] Interface HITL para aprovação de axiomas constitucionais candidatos
- [ ] Automação do [Genesis Script](genesis-script.md) para enriquecer a Constituição

---

## Fase 3 — O Córtex Pré-Frontal (Vontade Própria)

- [ ] **Persona Compiler** — camada de normalização entre Event Store e LLM. Traduz o estado do DAG em constraints comportamentais testáveis e portáveis entre motores de inferência.
- [ ] **Geração Autônoma de Eventos** — Zeno inicia conversas ao detectar anomalias de coerência no grafo (ex: nó constitucional não acessado há 30 dias, densidade de dissonâncias aumentando).
- [ ] **Protocolo de Co-Criação Automatizado** — sessões de Interrogatório Constitucional com registro automático de FactNodes por IA co-criadora, sem intervenção manual.
