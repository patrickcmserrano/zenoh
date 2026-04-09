<script>
  import { onMount } from 'svelte';
  import { marked } from 'marked';

  let docs = $state([]);
  let selectedDoc = $state(null);
  let content = $state('');

  onMount(async () => {
    try {
      const res = await fetch('/docs-list.json');
      docs = await res.json();
      if (docs.length > 0) {
        loadDoc(docs[0]);
      }
    } catch (e) {
      console.error('Falha ao carregar lista:', e);
    }
  });

  async function loadDoc(doc) {
    selectedDoc = doc;
    const res = await fetch(`/docs/${doc}`);
    const text = await res.text();

    // Se o fetch falhar e o Vite retornar o index.html por engano
    if (text.trim().startsWith('<!DOCTYPE html>')) {
      content = '<p style="color:red">Documento não encontrado ou erro no servidor.</p>';
    } else {
      content = await marked(text);
    }
  }
</script>

<div class="layout">
  <aside>
    <h3>Zenoh Docs</h3>
    <ul>
      {#each docs as doc}
        <li class:active={selectedDoc === doc} onclick={() => loadDoc(doc)}>
          {doc}
        </li>
      {/each}
    </ul>
  </aside>
  <main>
    <article>
      {@html content}
    </article>
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #333;
    line-height: 1.6;
    background: #fff;
  }
  .layout {
    display: flex;
    height: 100vh;
  }
  aside {
    width: 280px;
    background: #f9f9f9;
    padding: 20px;
    border-right: 1px solid #eee;
    overflow-y: auto;
  }
  main {
    flex: 1;
    padding: 40px;
    overflow-y: auto;
    background: #fff;
  }
  article {
    max-width: 800px;
    margin: 0 auto;
  }
  h3 {
    margin-top: 0;
    color: #888;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    padding: 12px 16px;
    cursor: pointer;
    border-radius: 8px;
    margin-bottom: 6px;
    font-size: 0.9rem;
    transition: all 0.15s ease-in-out;
    color: #555;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  li:hover {
    background: #eee;
    color: #000;
  }
  li.active {
    background: #000;
    color: #fff;
    font-weight: 500;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  :global(h1, h2, h3, h4) {
    color: #111;
    margin-top: 1.5em;
  }
  :global(img) {
    max-width: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
  :global(pre) {
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 24px;
    border-radius: 12px;
    overflow-x: auto;
    font-size: 0.85rem;
    line-height: 1.5;
    margin: 20px 0;
  }
  :global(code) {
    font-family: 'SF Mono', 'JetBrains Mono', 'Fira Code', monospace;
  }
  :global(blockquote) {
    border-left: 4px solid #000;
    margin: 0;
    padding-left: 20px;
    color: #666;
    font-style: italic;
  }
</style>
