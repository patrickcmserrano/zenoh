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
    const res  = await fetch(`/docs/${doc}`);
    const text = await res.text();
    html = text.trim().startsWith('<!DOCTYPE')
      ? '<p style="color:red">Documento não encontrado.</p>'
      : await marked(text);

    const src = audioMap[doc] ?? null;
    if (src !== audioSrc) {
      audioSrc    = src;
      playing     = false;
      currentTime = 0;
      duration    = 0;
    }
  }
</script>

<div class="layout">
  <DocsSidebar
    {docs}
    {selectedDoc}
    {audioMap}
    onSelect={loadDoc}
    {onBack}
  />
  <main class:has-player={audioSrc}>
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
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  main {
    flex: 1;
    padding: 60px;
    overflow-y: auto;
    background: #fff;
  }
  main.has-player {
    padding-bottom: 80px;
  }
</style>
