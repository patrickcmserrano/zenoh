<script>
  let { docs = [], selectedDoc = null, audioMap = {}, onSelect, onBack } = $props();
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
      <li
        class:active={selectedDoc === doc}
        onclick={() => onSelect(doc)}
        onkeydown={(e) => e.key === 'Enter' && onSelect(doc)}
        role="button"
        tabindex="0"
        title={doc}
      >
        {#if audioMap[doc]}<span class="has-audio" aria-label="tem áudio">▶</span>{/if}{doc}
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
    padding: 12px 16px;
    cursor: pointer;
    border-radius: 4px;
    margin-bottom: 4px;
    font-size: 0.85rem;
    font-family: 'IBM Plex Mono', monospace;
    transition: all 0.2s;
    color: #888;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  li:hover { background: #1a1a1a; color: #fff; }
  li.active { background: #00F5FF; color: #000; font-weight: 500; }
  .has-audio {
    font-size: 0.55rem;
    color: #00F5FF;
    margin-right: 5px;
    opacity: 0.7;
  }
  li.active .has-audio { color: #000; opacity: 1; }
</style>
