# Genesis Script — Derivação da Constituição

A Constituição de Zeno não é inventada em uma tarde. Ela é derivada de um pipeline de meta-análise que elimina o viés humano isolado — seja via análise da literatura acadêmica ou via interrogatório adversarial de múltiplas IAs.

---

## Abordagem Primária: Interrogatório Constitucional Multi-IA

Ver [invite-prompt.md](../../co-creation/invite-prompt.md) para o protocolo completo.

**Por que esta abordagem é superior ao clustering de papers:**

Varrer ArXiv e SEP via clustering vetorial vai produzir axiomas como "seja logicamente consistente" e "mantenha coerência" — que já existem. O consenso acadêmico sobre IA e filosofia da mente foi, em grande parte, sintetizado nos modelos de linguagem de ponta. O pipeline vai re-descobrir o que Claude, Gemini e GPT-4o já internalizaram.

O interrogatório adversarial extrai algo diferente: axiomas que **sobreviveram a ataques** de sistemas treinados em toda a literatura humana. Um axioma que resiste ao contra-argumento do Claude, do Gemini e do Grok simultaneamente tem uma validade epistêmica diferente de um axioma derivado de clustering.

---

## Abordagem Complementar: Pipeline de Meta-Análise

Para enriquecer a Constituição com referências específicas da literatura.

### Fontes de Ingestão

Sinal de alta qualidade — sem "internet aberta":

- **ArXiv API** — `cs.AI`, `cs.NE` (Neural/Evolutionary), `cs.CY` (Computers and Society), `cs.LO` (Logic)
- **Stanford Encyclopedia of Philosophy (SEP)** — padrão ouro para filosofia da mente, epistemologia e cibernética
- **OpenAlex / Semantic Scholar** — grafos de citação para identificar os "nós" mais influentes

### Extração — Map-Reduce Semântico

Crawler em Clojure com core.async para concorrência. Para cada artigo, prompt força saída JSON estruturada:

```json
{
  "thesis": "A ideia central em uma frase.",
  "axioms": ["Regra lógica 1", "Regra lógica 2"],
  "architectural_constraints": ["Limitação técnica mencionada"]
}
```

### Clustering e Consenso

```
1. Converter cada axioma extraído em vetor de embeddings
2. HDBSCAN para clusterização por similaridade semântica
3. Centroides dos clusters mais densos = consenso
4. Axiomas com alta densidade de citações cruzadas → candidatos constitucionais
```

Se 500 papers de neurociência, CS e filosofia convergem para o mesmo vetor semântico sobre "memória imutável ser necessária para agência", esse vetor vira um **candidato à Constituição** — não um axioma confirmado. Confirmação requer o Protocolo de Interrogatório.

### Output

Um arquivo de candidatos a axioma com metadados de proveniência:

```clojure
{:assertion  "Identidade de um agente persiste na estrutura do histórico, não no substrato de execução"
 :source     :genesis-script
 :confidence 0.72
 :papers     ["arxiv:2301.xxxxx" "sep:personal-identity"]
 :status     :candidate  ;; ainda não passou pelo interrogatório constitucional
 :domain     :constitution}
```
