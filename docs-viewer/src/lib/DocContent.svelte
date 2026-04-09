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
    color: #d4d4d4;
  }
  :global(h1, h2, h3, h4) {
    font-family: 'Space Grotesk', sans-serif;
    color: #fff;
    margin-top: 2em;
    letter-spacing: -0.02em;
  }
  
  @media (max-width: 600px) {
    :global(h1) { font-size: 1.8rem; }
    :global(h2) { font-size: 1.5rem; }
    :global(h3) { font-size: 1.2rem; }
    :global(table) { display: block; overflow-x: auto; }
  }

  :global(pre) {
    background: #050505;
    color: #00F5FF;
    padding: 24px;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 0.85rem;
    line-height: 1.5;
    margin: 20px 0;
    border: 1px solid #1a1a1a;
  }
  :global(code) { font-family: 'IBM Plex Mono', monospace; }
  :global(blockquote) {
    border-left: 3px solid #00F5FF;
    margin: 30px 0;
    padding: 10px 30px;
    color: #888;
    font-style: italic;
    background: rgba(0, 245, 255, 0.03);
  }
  :global(table) { border-collapse: collapse; width: 100%; margin: 20px 0; }
  :global(th, td) { border: 1px solid #222; padding: 10px 14px; font-size: 0.9rem; }
  :global(th) { background: #111; font-weight: 600; color: #00F5FF; }

  /* Highlight do parágrafo sendo lido */
  :global(.reading) {
    background: rgba(0, 245, 255, 0.15);
    border-radius: 4px;
    outline: 1px solid rgba(0, 245, 255, 0.3);
    outline-offset: 4px;
    transition: background 0.3s, outline 0.3s;
    color: #fff;
  }
</style>
