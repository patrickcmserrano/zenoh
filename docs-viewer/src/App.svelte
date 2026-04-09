<script>
  import { onMount, onDestroy } from 'svelte';
  import { marked } from 'marked';
  import Genesis from './Genesis.svelte';

  let mode = $state('genesis'); 
  let docs = $state([]);
  let groupedDocs = $state({});
  let audioMap = $state({});
  let selectedDoc = $state(null);
  let content = $state('');
  let sidebarCollapsed = $state(false);
  
  // Audio state
  let audioSrc = $state('');
  let playing = $state(false);
  let audioEl = $state(null);
  let currentTime = $state(0);
  let duration = $state(0);
  let playbackRate = $state(1.0);

  onMount(async () => {
    try {
      const res = await fetch('/docs-list.json');
      const flatList = await res.json();
      docs = flatList;
      
      const audioRes = await fetch('/audio-map.json');
      audioMap = await audioRes.json();

      const groups = {};
      flatList.forEach(path => {
        const parts = path.split('/');
        let groupName = parts.length > 1 ? parts[0].toUpperCase() : 'CORE';
        if (groupName === 'DOCS' && parts.length > 2) {
          groupName = parts[1].toUpperCase();
        }
        if (!groups[groupName]) groups[groupName] = [];
        
        let displayName = parts[parts.length - 1];
        if (displayName === 'ROOT_README.md') displayName = 'README.md';

        groups[groupName].push({
          name: displayName,
          path: path,
          hasAudio: !!(audioMap[path] || audioMap[path.replace('docs/', '')])
        });
      });
      groupedDocs = groups;

      window.addEventListener('hashchange', handleHashChange);
      handleHashChange(); 
    } catch (e) {
      console.error('Falha ao carregar dados:', e);
    }
  });

  onDestroy(() => {
    window.removeEventListener('hashchange', handleHashChange);
  });

  function handleHashChange() {
    const hash = window.location.hash.replace('#', '');
    if (!hash || hash === 'genesis' || hash === '/') {
      mode = 'genesis';
    } else {
      mode = 'docs';
      if (docs.includes(hash)) {
        loadDoc(hash);
      } else if (docs.length > 0) {
        window.location.hash = '#' + (selectedDoc || 'docs/genesis.md');
      }
    }
  }

  async function loadDoc(docPath) {
    if (selectedDoc === docPath) return; 
    selectedDoc = docPath;
    let fetchPath = `/${docPath}`;

    try {
      const res = await fetch(fetchPath);
      const text = await res.text();

      if (text.trim().startsWith('<!DOCTYPE html>')) {
        content = '<p style="color:red">Documento não encontrado ou erro no servidor.</p>';
      } else {
        content = await marked(text);
      }
      
      const foundAudio = audioMap[docPath] || audioMap[docPath.replace('docs/', '')];
      if (foundAudio) {
        audioSrc = foundAudio;
      } else {
        audioSrc = '';
      }
      
      playing = false;
      currentTime = 0;
      playbackRate = 1.0;
    } catch (e) {
      content = '<p style="color:red">Erro ao carregar documento.</p>';
    }
  }

  function togglePlay() {
    if (!audioEl) return;
    playing ? audioEl.pause() : audioEl.play();
  }

  function cycleRate() {
    if (!audioEl) return;
    playbackRate = playbackRate === 1.0 ? 1.5 : playbackRate === 1.5 ? 2.0 : 1.0;
    audioEl.playbackRate = playbackRate;
  }

  function seek(e) {
    if (!audioEl || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audioEl.currentTime = pos * duration;
  }

  function fmt(s) {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = String(Math.floor(s % 60)).padStart(2, '0');
    return `${m}:${sec}`;
  }

  function enterDocs() {
    window.location.hash = '#' + (selectedDoc || 'docs/genesis.md');
  }

  function backToGenesis() {
    window.location.hash = '#genesis';
  }

  function navigateToDoc(docPath) {
    window.location.hash = '#' + docPath;
  }

  function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed;
  }
</script>

{#if mode === 'genesis'}
  <Genesis onEnterDocs={enterDocs} />
{:else}
  <div class="layout" class:collapsed={sidebarCollapsed}>
    <aside>
      <div class="sidebar-scroll-area">
        <div class="sidebar-header" onclick={backToGenesis} onkeydown={backToGenesis} role="button" tabindex="0">
          <h3 class="zenoh-sidebar-title">ZENOH</h3>
          <p>← VOLTAR PARA GENESIS</p>
        </div>
        <nav>
          {#each Object.entries(groupedDocs) as [group, items]}
            <div class="nav-group">
              <h4 class="group-title">{group}</h4>
              <ul>
                {#each items as item}
                  <li class:active={selectedDoc === item.path} onclick={() => navigateToDoc(item.path)} onkeydown={() => navigateToDoc(item.path)} role="button" tabindex="0">
                    {#if item.hasAudio}<span class="audio-dot"></span>{/if}
                    {item.name}
                  </li>
                {/each}
              </ul>
            </div>
          {/each}
        </nav>
      </div>

      {#if audioSrc}
        <div class="sidebar-player">
          <div class="player-controls">
            <button class="play-btn" onclick={togglePlay}>
              {playing ? '⏸' : '▶'}
            </button>
            <div class="player-meta">
              <span class="player-label">AUDIO LOG</span>
              <span class="player-time">{fmt(currentTime)} / {fmt(duration)}</span>
            </div>
            <button class="rate-btn" onclick={cycleRate}>
              {playbackRate}x
            </button>
          </div>
          <div class="timeline-container" onclick={seek} onkeydown={seek} role="progressbar" aria-valuenow={currentTime} aria-valuemax={duration} tabindex="0">
            <div class="timeline-bg">
              <div class="timeline-progress" style="width: {(currentTime / duration) * 100}%"></div>
            </div>
          </div>
        </div>
      {/if}
    </aside>

    <button class="sidebar-toggle" onclick={toggleSidebar} aria-label="Toggle Sidebar">
      {sidebarCollapsed ? '→' : '←'}
    </button>

    <main>
      <article>
        {@html content}
      </article>
    </main>
  </div>

  {#if audioSrc}
    <!-- svelte-ignore a11y_media_has_caption -->
    <audio 
      bind:this={audioEl}
      src={audioSrc}
      onplay={() => (playing = true)}
      onpause={() => (playing = false)}
      ontimeupdate={() => (currentTime = audioEl?.currentTime ?? 0)}
      onloadedmetadata={() => {
        duration = audioEl?.duration ?? 0;
        audioEl.playbackRate = playbackRate;
      }}
      onended={() => (playing = false)}
    ></audio>
  {/if}
{/if}

<style>
  :global(*) {
    box-sizing: border-box;
  }

  :global(html) {
    font-size: 130%; 
  }

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Space Grotesk', sans-serif;
    background: #000;
    overflow: hidden;
    width: 100%;
    height: 100%;
    color: #fff;
    line-height: 1.6;
  }

  .layout {
    display: grid;
    grid-template-columns: 380px 1fr;
    width: 100vw;
    height: 100vh;
    background: #050505;
    color: #d4d4d4;
    animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    position: relative;
    z-index: 20;
    overflow: hidden;
    transition: grid-template-columns 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .layout.collapsed {
    grid-template-columns: 0px 1fr;
  }

  @keyframes slideUp {
    from { transform: translateY(100vh); }
    to { transform: translateY(0); }
  }

  aside {
    background: #000;
    color: #fff;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #111;
    height: 100vh;
    justify-content: space-between;
    overflow: hidden;
    width: 380px;
  }

  .sidebar-scroll-area {
    flex: 1;
    overflow-y: auto;
    min-height: 0; 
    display: flex;
    flex-direction: column;
  }

  .sidebar-header {
    padding: 1.5rem;
    border-bottom: 1px solid #111;
    flex-shrink: 0;
    cursor: pointer;
    background: #000;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .zenoh-sidebar-title {
    margin: 0;
    font-size: 1.5rem;
    letter-spacing: 0.3em;
    font-family: 'IBM Plex Mono', monospace;
    color: #fff;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  }

  .sidebar-header p {
    font-size: 0.6rem;
    color: #444;
    margin: 0.5rem 0 0 0;
    letter-spacing: 0.1em;
  }

  nav {
    padding: 1rem;
    flex: 1;
  }

  .nav-group {
    margin-bottom: 2rem;
  }

  .group-title {
    font-size: 0.65rem;
    color: #333;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    margin-bottom: 1rem;
    padding-left: 1rem;
    border-left: 1px solid #111;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 0.7rem 1rem;
    cursor: pointer;
    border-radius: 6px;
    margin-bottom: 0.3rem;
    font-size: 0.85rem;
    font-family: 'IBM Plex Mono', monospace;
    transition: all 0.2s;
    color: #555;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
  }

  .audio-dot {
    width: 6px;
    height: 6px;
    background: #00F5FF;
    border-radius: 50%;
    margin-right: 0.7rem;
    box-shadow: 0 0 5px #00F5FF;
    flex-shrink: 0;
  }

  li:hover {
    background: #0a0a0a;
    color: #eee;
  }

  li.active {
    background: #0a0a0a;
    color: #00F5FF;
    font-weight: 500;
  }

  .sidebar-toggle {
    position: fixed;
    bottom: 2rem;
    left: 1.5rem;
    z-index: 100;
    background: #000;
    border: 1px solid #111;
    color: #00F5FF;
    width: 2.5rem;
    height: 2.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  }

  .sidebar-toggle:hover {
    border-color: #00F5FF;
    box-shadow: 0 0 15px rgba(0, 245, 255, 0.2);
  }

  .layout.collapsed .sidebar-toggle {
    left: 1.5rem;
  }

  .sidebar-player {
    background: #050505;
    padding: 1.5rem;
    border-top: 1px solid #111;
    border-left: 3px solid #00F5FF;
    flex-shrink: 0;
  }

  .player-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .play-btn {
    background: #111;
    border: 1px solid #222;
    color: #00F5FF;
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    font-size: 1rem;
  }

  .play-btn:hover {
    border-color: #00F5FF;
    box-shadow: 0 0 10px rgba(0, 245, 255, 0.2);
  }

  .rate-btn {
    background: none;
    border: 1px solid #1A1A1A;
    color: #666;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.65rem;
    padding: 4px 8px;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s;
    margin-left: auto;
  }

  .rate-btn:hover {
    color: #00F5FF;
    border-color: #00F5FF;
    background: rgba(0, 245, 255, 0.05);
  }

  .player-meta {
    display: flex;
    flex-direction: column;
  }

  .player-label {
    font-size: 0.55rem;
    color: #444;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-family: 'IBM Plex Mono', monospace;
  }

  .player-time {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.7rem;
    color: #888;
  }

  .timeline-container {
    width: 100%;
    cursor: pointer;
  }

  .timeline-bg {
    width: 100%;
    height: 2px;
    background: #111;
    position: relative;
  }

  .timeline-progress {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: #00F5FF;
    box-shadow: 0 0 8px #00F5FF;
  }

  main {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background: #050505;
    padding: 4rem 3.5rem;
    display: block;
    border-left: 1px solid #111;
  }

  article {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    line-height: 1.8;
    color: #d4d4d4;
  }

  :global(h1, h2, h3, h4) {
    font-family: 'Space Grotesk', sans-serif;
    color: #fff;
    margin-top: 2.5em;
    font-weight: 500;
  }

  :global(h1) { font-size: 2.8rem; border-bottom: 1px solid #1A1A1A; padding-bottom: 1.5rem; }
  :global(h2) { font-size: 1.8rem; color: #00F5FF; opacity: 0.9; }

  :global(pre) {
    background: #000;
    color: #a0a0a0;
    padding: 2rem;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 0.85rem;
    line-height: 1.6;
    margin: 2rem 0;
    border: 1px solid #111;
  }

  :global(code) {
    font-family: 'IBM Plex Mono', monospace;
    background: #111;
    color: #00F5FF;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 0.85em;
  }

  :global(blockquote) {
    border-left: 3px solid #00F5FF;
    margin: 3rem 0;
    padding: 0.5rem 2.5rem;
    color: #888;
    font-style: italic;
    background: rgba(0, 245, 255, 0.02);
  }

  main::-webkit-scrollbar, .sidebar-scroll-area::-webkit-scrollbar {
    width: 6px;
  }
  main::-webkit-scrollbar-track, .sidebar-scroll-area::-webkit-scrollbar-track {
    background: #050505;
  }
  main::-webkit-scrollbar-thumb, .sidebar-scroll-area::-webkit-scrollbar-thumb {
    background: #111;
  }
  main::-webkit-scrollbar-thumb:hover, .sidebar-scroll-area::-webkit-scrollbar-thumb:hover {
    background: #00F5FF;
  }
</style>
