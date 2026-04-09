# Perfil do Engenheiro e Alinhamento de Stack

*Análise do CV de Patrick Serrano (Clojure Engineer | Functional Systems & AI Integration) e suas implicações para o projeto Zeno.*

---

## A Convergência Não Acidental

O projeto Zeno foi concebido filosoficamente antes de se tornar técnico. Mas ao analisar o perfil de Patrick, a escolha da stack deixa de ser uma decisão de design — torna-se uma consequência natural de quem ele é como engenheiro.

**Clojure e Zeno compartilham o mesmo axioma fundacional:** "Values, not places." Rich Hickey projetou Clojure em torno da imutabilidade como padrão, não como convenção. Em Clojure, um map é imutável por definição — você não precisa de disciplina para não fazer `UPDATE`, porque a linguagem não pensa em termos de mutação.

```clojure
;; Em Clojure, isso já é verdade sem esforço:
(def fact-node
  {:event-id   "sha256-abc123"
   :actor      "Patrick"
   :assertion  "NATS é o message bus da arquitetura"
   :confidence 0.95
   :domain     :architecture})

;; fact-node é imutável. Não existe (assoc! fact-node :confidence 0.3).
;; Para "mudar", você cria um novo valor que aponta para o antigo.
;; Isso é exatamente o que o FactNode DAG de Zeno faz.
```

**Patrick já construiu Zeno antes, sem saber.** O trabalho em FinTech com Datomic + Event Sourcing para dados financeiros imutáveis é estruturalmente idêntico ao que o projeto propõe para memória de IA. A única diferença é o domínio: transações financeiras → interações cognitivas.

---

## Mapeamento de Especialidades → Componentes de Zeno

| Especialidade no CV | Componente de Zeno | Aproveitamento |
| :---- | :---- | :---- |
| **Datomic** (produção, FinTech) | Event Store — a alma do sistema | Direto. Patrick conhece `d/transact!`, `d/q`, `d/history`, `d/as-of`. O bitemporal é sua segunda natureza. |
| **Onyx** (streaming pipeline, FinTech — *histórico*) | Modelo mental do Dream Worker | Onyx está deprecated, mas o padrão aprendido (pipeline assíncrono, ETL em stages) mapeia diretamente para Temporal Workflows + Activities, que é o substituto atual. |
| **NATS JetStream** (Ark Engine, produção) | Event Bus — ingestão de eventos | Direto. Já em produção no seu próprio trading engine. |
| **core.async** (Clojure ecosystem) | Concorrência do gateway e Coherence Processor | Direto. Channels e go blocks com semântica mais composável que goroutines. |
| **Qdrant** (skills atuais) | Vector Index — retrieval semântico | Direto. Já está construindo RAG pipelines com Qdrant. Zeno é a aplicação arquitetural completa. |
| **LLM API integration** (OpenAI, Anthropic, Gemini) | LLM Engine — renderizador de linguagem | Direto. O Coherence Processor é a camada que falta entre "chamar uma API de LLM" e "ter uma entidade com memória". |
| **Event Sourcing / CQRS** (arquitetura) | Toda a identidade imutável de Zeno | Fundacional. Zeno É Event Sourcing aplicado a identidade de IA. |
| **Polylith architecture** (refatoração FinTech) | Separação de componentes | Zeno em Polylith: `event-store`, `coherence-processor`, `dream-worker`, `llm-gateway` como componentes isolados. |

---

## Resume-Driven Development: O Que Zeno Constrói no CV

Patrick se posiciona como: *"Clojure Engineer | Functional Systems & AI Integration"*

Construir Zeno com esta stack é a materialização literal desse posicionamento. Cada componente implementado vira evidência demonstrável:

| O que é construído | Como aparece no CV |
| :---- | :---- |
| Event Store com Datomic para memória de IA | "Applied Datomic's immutable event model to AI agent memory persistence" |
| Dream Worker com Temporal para consolidação semântica | "Built async semantic ETL pipelines using Temporal Workflows for LLM context compression" |
| Coherence Processor com RAG + LLM Checker | "Designed contradiction-enforcement middleware for LLM agents using vector retrieval" |
| Constituição derivada de multi-AI interrogatório | "Developed Constitutional AI framework via adversarial multi-model consensus protocol" |
| Sistema completo de EDP | "Architected a persistent digital entity (sovereign AI agent) with immutable event sourcing identity" |

**O posicionamento de mercado resultante:** engenheiros que dominam Datomic + RAG + arquitetura de agentes de IA são extremamente raros. A maioria dos engenheiros de AI não sabe Datomic. A maioria dos engenheiros Clojure não sabe RAG. Patrick está nos dois lados — e Zeno é a prova.

---

## A Física no Sistema

Patrick tem Bacharelado em Física (UFF). Isso não é dado decorativo.

A formação em Física explica:
- O conforto com a Engine de Saliência (`M(t) = S₀·e^(-λt) + V`) — não como metáfora, mas como equação de decaimento com parâmetros calibráveis
- A intuição para sistemas com invariantes e simetrias — a imutabilidade como lei de conservação
- O pensamento em termos de estado e evolução temporal — bitemporal = mecânica estatística no tempo
- A capacidade de modelar o "esquecimento" como decaimento exponencial (física de partículas → física de memória)

A função de decaimento de Zeno não é emprestada da neurociência humana — é uma equação de física aplicada à relevância informacional. Patrick pode refiná-la matematicamente, não apenas intuitivamente.

---

## Stack Final Recomendada

```
Core: Clojure
├── API Gateway:      Ring + core.async
├── Event Store:      Datomic (primário — experiência de produção)
│                     XTDB (alternativa open-source)
├── Message Bus:      NATS JetStream
├── Dream Worker:     Temporal.io (Workflows + Activities)
├── Vector Index:     Qdrant
├── Working Memory:   Redis Stack
├── LLM Engine:       Groq API + Ollama
└── Frontend (HITL):  re-frame / Reagent (ClojureScript)

Performance crítica (se necessário):
└── Go — apenas módulos com requisito sub-ms (experiência Ark Engine)
```
