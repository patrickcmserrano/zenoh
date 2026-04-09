<script>
  import { onMount } from 'svelte';
  import { marked } from 'marked';
  import DocsSidebar from './lib/DocsSidebar.svelte';
  import DocContent from './lib/DocContent.svelte';
  import AudioPlayer from './lib/AudioPlayer.svelte';

  let { onBack } = $props();

  let docs      = $state([]);
  let audioMap  = $state({});
  let selectedDoc = $state(null);
  let html      = $state('');
  let audioSrc  = $state(null);
  let isSidebarOpen = $state(false); // Novo estado para mobile

  // Estado do áudio — elevado aqui para que DocContent possa ler
  let playing     = $state(false);
  let currentTime = $state(0);
  let duration    = $state(0);

  onMount(async () => {
    const [docsRes, audioRes] = await Promise.all([
      fetch('/docs-list.json'),
      fetch('/audio-map.json').catch(() => ({ ok: false })),
    ]);
    docs = await docsRes.json();
    if (audioRes.ok) audioMap = await audioRes.json();
    if (docs.length > 0) loadDoc(docs[0]);
  });

  async function loadDoc(doc) {
    selectedDoc = doc;
    isSidebarOpen = false; // Fecha no mobile ao selecionar
    
    // docs-list.json já contém os caminhos relativos à raiz do servidor (ex: "docs/genesis.md")
    // Então o fetch deve ser direto na raiz.
    const res  = await fetch(`/${doc}`);
    const text = await res.text();
    html = text.trim().startsWith('<!DOCTYPE')
      ? '<p style="color:red">Documento não encontrado.</p>'
      : await marked(text);

    // O audio-map.json usa o nome do arquivo SEM o prefixo "docs/", se houver.
    const audioKey = doc.startsWith('docs/') ? doc.substring(5) : doc;
    const src = audioMap[audioKey] ?? null;
    
    if (src !== audioSrc) {
      audioSrc    = src;
      playing     = false;
      currentTime = 0;
      duration    = 0;
    }
  }
</script>

<div class="layout" class:sidebar-open={isSidebarOpen}>
  <button class="sidebar-toggle" onclick={() => (isSidebarOpen = !isSidebarOpen)} aria-label="Menu">
    {isSidebarOpen ? '✕' : '☰'}
  </button>

  <DocsSidebar
    {docs}
    {selectedDoc}
    {audioMap}
    onSelect={loadDoc}
    {onBack}
  />
  <main 
    class:has-player={audioSrc} 
    onclick={() => { if (window.innerWidth <= 768 && isSidebarOpen) isSidebarOpen = false; }}
    onkeydown={(e) => { if (e.key === 'Escape' && isSidebarOpen) isSidebarOpen = false; }}
    role="presentation"
  >
    <DocContent {html} {currentTime} {duration} {playing} />
  </main>
</div>

<AudioPlayer
  {audioSrc}
  docLabel={selectedDoc ?? ''}
  bind:playing
  bind:currentTime
  bind:duration
/>

<style>
  .layout {
    display: flex;
    height: 100vh;
    animation: fadeIn 0.5s ease-out;
    font-family: 'Space Grotesk', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .sidebar-toggle {
    display: flex;
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 400;
    background: #00F5FF;
    color: #000;
    border: none;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.5rem;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 15px rgba(0, 245, 255, 0.4);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .sidebar-toggle:hover {
    transform: scale(1.1);
    background: #fff;
  }

  .layout.sidebar-open .sidebar-toggle {
    left: 290px;
    background: #050505;
    color: #00F5FF;
    border: 1px solid #00F5FF;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  main {
    flex: 1;
    padding: 60px 60px 60px 80px; /* Padding extra na esquerda para o botão */
    overflow-y: auto;
    background: #0a0a0a;
    transition: filter 0.3s, opacity 0.3s, padding-left 0.3s;
    color: #e0e0e0;
  }

  .layout.sidebar-open main {
    padding-left: 60px; /* Reduz padding quando sidebar está aberta */
  }

  main.has-player {
    padding-bottom: 80px;
  }

  @media (max-width: 768px) {
    main {
      padding: 100px 20px 40px;
    }

    .layout.sidebar-open main {
      filter: blur(8px) brightness(0.2);
      pointer-events: none;
      opacity: 0.3;
    }
  }
</style>
