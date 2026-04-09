<script>
  import { fmt } from './utils.js';

  let {
    audioSrc = null,
    docLabel = '',
    playing   = $bindable(false),
    currentTime = $bindable(0),
    duration    = $bindable(0),
  } = $props();

  let audioEl = $state(null);

  // Recarrega o elemento quando a fonte muda
  // (reset de playing/currentTime/duration é responsabilidade de DocsView)
  $effect(() => {
    if (audioSrc && audioEl) audioEl.load();
  });

  function togglePlay() {
    if (!audioEl) return;
    playing ? audioEl.pause() : audioEl.play();
  }

  function seek(e) {
    if (!audioEl || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audioEl.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  }
</script>

{#if audioSrc}
  <!-- svelte-ignore a11y_media_has_caption -->
  <audio
    bind:this={audioEl}
    src={audioSrc}
    onplay={() => (playing = true)}
    onpause={() => (playing = false)}
    ontimeupdate={() => (currentTime = audioEl?.currentTime ?? 0)}
    onloadedmetadata={() => (duration = audioEl?.duration ?? 0)}
    onended={() => (playing = false)}
  ></audio>

  <div class="player" data-testid="audio-player">
    <button class="play-btn" onclick={togglePlay} aria-label={playing ? 'Pausar' : 'Reproduzir'}>
      {playing ? '⏸' : '▶'}
    </button>
    <span class="doc-label">{docLabel}</span>
    <div
      class="timeline"
      onclick={seek}
      onkeydown={(e) => e.key === 'ArrowRight' && seek(e)}
      role="progressbar"
      tabindex="0"
      aria-valuenow={currentTime}
      aria-valuemax={duration}
      aria-label="Progresso do áudio"
    >
      <div class="progress" style="width: {duration ? (currentTime / duration) * 100 : 0}%"></div>
    </div>
    <span class="time" data-testid="audio-time">{fmt(currentTime)} / {fmt(duration)}</span>
  </div>
{/if}

<style>
  .player {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: #0a0a0a;
    border-top: 1px solid #1a1a1a;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 0 24px;
    z-index: 200;
  }
  .play-btn {
    background: none;
    border: 1px solid #333;
    color: #00F5FF;
    font-size: 0.9rem;
    cursor: pointer;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.15s;
    flex-shrink: 0;
    font-family: 'IBM Plex Mono', monospace;
  }
  .play-btn:hover { background: #1a1a1a; border-color: #00F5FF; }
  .doc-label {
    font-size: 0.7rem;
    color: #555;
    font-family: 'IBM Plex Mono', monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 220px;
    flex-shrink: 0;
  }
  .timeline {
    flex: 1;
    height: 3px;
    background: #1a1a1a;
    border-radius: 2px;
    cursor: pointer;
    transition: height 0.1s;
  }
  .timeline:hover { height: 5px; }
  .progress {
    height: 100%;
    background: #00F5FF;
    border-radius: 2px;
    transition: width 0.1s linear;
  }
  .time {
    font-size: 0.7rem;
    color: #555;
    font-family: 'IBM Plex Mono', monospace;
    white-space: nowrap;
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
  }
</style>
