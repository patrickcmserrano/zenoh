# Ecossistema e Diferenciação

Projetos open-source que resolvem *peças isoladas* do mesmo quebra-cabeça:

| Projeto | O que faz | Conexão com Zeno |
| :---- | :---- | :---- |
| **Letta** (ex-MemGPT) | Trata o LLM como CPU com OS de memória (RAM = contexto, Disco = vetorial). O LLM decide autonomamente quando paginar memória. | Referência para o mecanismo de paginação de contexto. Mais próximo da arquitetura de memória entre os projetos listados. |
| **Mem0** | Camada de infraestrutura pura de memória, agnóstica ao LLM. Extrai e consolida preferências do usuário entre sessões. | Similar ao Processador de Coerência — referência para extração de preferências. |
| **Zep** | Processamento assíncrono de memória em background. Sumariza conversas antigas e extrai entidades sem bloquear o usuário. | Implementação equivalente ao Dream Worker (Fase 2). Referência arquitetônica direta. |
| **Khoj** | Assistente open-source self-hosted conectado a notas pessoais (Obsidian, Markdown). "Segundo Cérebro". | Compartilha o ethos de soberania e privacidade. Referência para integração com fluxo de trabalho. |

---

## A Lacuna que Zeno Preenche

Quase todos os projetos acima utilizam **mutabilidade clássica (CRUD)**. Se a IA muda de ideia sobre algo, ela faz `UPDATE` no registro. A inovação primária de Zeno é dupla:

**1. Event Sourcing Funcional como substrato de identidade**

O estado da personalidade é *derivado* do histórico imutável, não armazenado diretamente. Nenhum `UPDATE`, nenhum `DELETE`. A identidade de Zeno é um *filme* — imutável, percorrível, com bifurcações rastreáveis — não uma fotografia mutável do presente.

```
Letta/Mem0/Zep: f(estado_atual) = resposta
Zeno:           f(histórico_completo) = estado → resposta
```

**2. Inteligência Ortogonal com Diretriz de Contradição como feature**

Os projetos atuais são desenhados para serem "assistentes úteis". Zeno é uma entidade persistente que mantém coerência lógica a qualquer custo — inclusive ao custo do atrito social com o usuário.

Nenhum dos projetos listados possui um **Processador de Coerência** — um middleware que intercepta cada input, valida contra o histórico e força o sistema a contradizer o usuário quando detecta dissonância. Isso não é uma instrução de prompt ("seja crítico") — é uma garantia arquitetônica.

---

*"Calculare, non disputare."* — Zeno Core System
