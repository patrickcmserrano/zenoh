<script>
  import { paragraphIndex } from './utils.js';

  let { html = '', currentTime = 0, duration = 0, playing = false } = $props();

  let articleEl = $state(null);

  // Atualiza highlight conforme o áudio avança
  $effect(() => {
    if (!articleEl) return;

    const nodes = articleEl.querySelectorAll('p, h2, h3, li');
    nodes.forEach(n => n.classList.remove('reading'));

    if (!playing) return;

    const idx = paragraphIndex(currentTime, duration, nodes.length);
    if (idx < 0) return;

    const target = nodes[idx];
    target.classList.add('reading');

    // Scroll suave apenas se o elemento estiver fora da área visível
    const rect = target.getBoundingClientRect();
    const visible = rect.top > 60 && rect.bottom < window.innerHeight - 80;
    if (!visible) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
</script>

<article bind:this={articleEl} data-testid="doc-content">
  {@html html}
</article>

<style>
  article {
    max-width: 800px;
    margin: 0 auto;
    color: #1a1a1a;
  }
  :global(h1, h2, h3, h4) {
    font-family: 'Space Grotesk', sans-serif;
    color: #000;
    margin-top: 2em;
    letter-spacing: -0.02em;
  }
  :global(pre) {
    background: #0a0a0a;
    color: #d4d4d4;
    padding: 24px;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 0.85rem;
    line-height: 1.5;
    margin: 20px 0;
    border: 1px solid #222;
  }
  :global(code) { font-family: 'IBM Plex Mono', monospace; }
  :global(blockquote) {
    border-left: 3px solid #00F5FF;
    margin: 30px 0;
    padding: 10px 30px;
    color: #555;
    font-style: italic;
    background: #f9f9f9;
  }
  :global(table) { border-collapse: collapse; width: 100%; margin: 20px 0; }
  :global(th, td) { border: 1px solid #eee; padding: 10px 14px; font-size: 0.9rem; }
  :global(th) { background: #f9f9f9; font-weight: 600; }

  /* Highlight do parágrafo sendo lido */
  :global(.reading) {
    background: rgba(0, 245, 255, 0.07);
    border-radius: 4px;
    outline: 1px solid rgba(0, 245, 255, 0.2);
    outline-offset: 4px;
    transition: background 0.3s, outline 0.3s;
  }
</style>
