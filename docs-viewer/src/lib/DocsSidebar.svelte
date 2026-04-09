<script>
  let { docs = [], selectedDoc = null, audioMap = {}, onSelect, onBack } = $props();

  function getLabel(doc) {
    const parts = doc.split('/');
    const filename = parts.pop().replace('.md', '');
    
    // Se houver pastas, construir caminho hierárquico
    if (parts.length > 0) {
      const category = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' > ');
      const label = filename
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      return `${category} > ${label}`;
    }
    
    // Se for na raiz, apenas capitalizar
    const label = filename
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return label;
  }
</script>

<aside data-testid="docs-sidebar">
  <div
    class="sidebar-header"
    onclick={onBack}
    onkeydown={(e) => e.key === 'Enter' && onBack()}
    role="button"
    tabindex="0"
  >
    <h3>ZENOH DOCS</h3>
    <p>← Voltar para Genesis</p>
  </div>
  <ul>
    {#each docs as doc}
      {@const audioKey = doc.startsWith('docs/') ? doc.substring(5) : doc}
      {@const label = getLabel(doc)}
      <li>
        <button
          class:active={selectedDoc === doc}
          onclick={() => onSelect(doc)}
          title={doc}
        >
          {#if audioMap[audioKey]}<span class="has-audio" aria-label="tem áudio">▶</span>{/if}
          {label}
        </button>
      </li>
    {/each}
  </ul>
</aside>

<style>
  aside {
    width: 280px;
    background: #0a0a0a;
    color: #fff;
    padding: 20px;
    border-right: 1px solid #222;
    overflow-y: auto;
    flex-shrink: 0;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 250;
    position: relative;
    transform: translateX(-100%);
    margin-left: -280px; /* Esconde o espaço no desktop */
  }

  :global(.sidebar-open) aside {
    transform: translateX(0);
    margin-left: 0; /* Ocupa espaço quando aberta */
    box-shadow: 10px 0 30px rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 768px) {
    aside {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      margin-left: 0; /* Reset para mobile */
    }
  }

  .sidebar-header {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #222;
    cursor: pointer;
  }
  .sidebar-header h3 {
    margin: 0;
    letter-spacing: 0.2em;
    font-weight: 400;
    color: #00F5FF;
  }
  .sidebar-header p {
    font-size: 0.7rem;
    color: #666;
    margin: 5px 0 0 0;
    text-transform: uppercase;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    margin-bottom: 4px;
  }
  button {
    width: 100%;
    padding: 12px 16px;
    cursor: pointer;
    border: none;
    background: transparent;
    border-radius: 4px;
    font-size: 0.85rem;
    font-family: 'IBM Plex Mono', monospace;
    transition: all 0.2s;
    color: #888;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }
  button:hover { background: #1a1a1a; color: #fff; }
  button.active { background: #00F5FF; color: #000; font-weight: 500; }
  .has-audio {
    font-size: 0.55rem;
    color: #00F5FF;
    margin-right: 5px;
    opacity: 0.7;
  }
  button.active .has-audio { color: #000; opacity: 1; }
</style>
