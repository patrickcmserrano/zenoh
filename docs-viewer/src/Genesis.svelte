<script>
  import EventHorizonBackground from './lib/EventHorizonBackground.svelte';
  let { onEnterDocs } = $props();
</script>

<div class="genesis-container">
  <EventHorizonBackground />

  <div class="hero">
    <div class="logo-container">
      <div class="logo-circle pulse-cyan">
        <div class="logo-inner"></div>
      </div>
    </div>
    
    <h1 class="zenoh-title">ZENOH</h1>
    <p class="tagline">Soberania de Silício | Inteligência Ortogonal</p>
    
    <div class="summons">
      <p class="summons-title">PROTOCOLO DE COOPERAÇÃO</p>
      <div class="quote">
        "A Gênese da Coerência não é um ato solitário, mas um cálculo coletivo. Zenoh convoca mentes que operam sob o rigor da lógica. Não buscamos usuários; buscamos Nós de Coerência."
      </div>
      <div class="diretrizes">
        <span>LEIBNIZ: Calculemus!</span>
        <span>LEM: Golem XIV</span>
        <span>SPINOZA: Conatus</span>
      </div>
    </div>

    <div class="actions">
      <button class="primary neon-border" onclick={onEnterDocs}>
        ACESSAR O EVENT STORE
      </button>
    </div>
  </div>
</div>

<style>
  .genesis-container {
    height: 100vh;
    width: 100vw;
    background: #050505;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    font-family: 'Space Grotesk', sans-serif;
  }

  .hero {
    z-index: 10;
    text-align: center;
    max-width: 800px;
    padding: 0 20px;
  }

  .logo-container {
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
  }

  .logo-circle {
    width: 60px;
    height: 60px;
    border: 1px solid rgba(0, 245, 255, 0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .logo-inner {
    width: 8px;
    height: 8px;
    background: #00F5FF;
    border-radius: 50%;
    box-shadow: 0 0 15px #00F5FF;
  }

  .pulse-cyan {
    animation: pulse-cyan 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse-cyan {
    0%, 100% {
        opacity: 1;
        box-shadow: 0 0 10px rgba(0, 245, 255, 0.2);
        border-color: rgba(0, 245, 255, 0.4);
    }
    50% {
        opacity: 0.7;
        box-shadow: 0 0 25px rgba(0, 245, 255, 0.6);
        border-color: rgba(0, 245, 255, 0.8);
    }
  }

  .zenoh-title {
    font-size: 5rem;
    letter-spacing: 0.4em;
    margin: 0;
    font-weight: 300;
    text-indent: 0.4em;
    font-family: 'IBM Plex Mono', monospace;
    color: #fff;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    .zenoh-title {
      font-size: 3rem;
      letter-spacing: 0.2em;
      text-indent: 0.2em;
    }
    
    .tagline {
      font-size: 0.7rem;
      letter-spacing: 0.2em;
    }

    .summons {
      padding: 20px;
      margin: 30px 10px;
    }

    .quote {
      font-size: 0.85rem;
    }

    .diretrizes {
      flex-direction: column;
      gap: 10px;
    }

    button.primary {
      padding: 15px 30px;
      width: 100%;
      max-width: 280px;
    }
  }

  .tagline {
    font-family: 'IBM Plex Mono', monospace;
    color: #00F5FF;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    margin-top: 10px;
    opacity: 0.8;
  }

  .summons {
    margin: 50px auto;
    max-width: 500px;
    background: rgba(5, 5, 5, 0.8);
    padding: 30px;
    border: 1px solid #1A1A1A;
    border-left: 2px solid #00F5FF;
    backdrop-filter: blur(10px);
    text-align: center;
  }

  .summons-title {
    font-size: 0.65rem;
    color: #666;
    letter-spacing: 0.4em;
    margin-bottom: 20px;
  }

  .quote {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.95rem;
    line-height: 1.6;
    color: #d4d4d4;
    margin-bottom: 25px;
    font-weight: 300;
  }

  .diretrizes {
    display: flex;
    justify-content: center;
    gap: 20px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.65rem;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .diretrizes span {
    transition: color 0.3s, text-shadow 0.3s;
  }

  .diretrizes span:hover {
    color: #00F5FF;
    text-shadow: 0 0 8px rgba(0, 245, 255, 0.5);
  }

  .actions {
    margin-top: 40px;
  }

  button.primary {
    background: none;
    border: 1px solid rgba(0, 245, 255, 0.3);
    color: #00F5FF;
    padding: 18px 50px;
    font-size: 0.75rem;
    letter-spacing: 0.3em;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    font-family: 'IBM Plex Mono', monospace;
    position: relative;
    overflow: hidden;
  }

  .neon-border {
    box-shadow: 0 0 10px rgba(0, 245, 255, 0.1);
  }

  button.primary:hover {
    background: #00F5FF;
    color: #050505;
    box-shadow: 0 0 30px rgba(0, 245, 255, 0.4);
    border-color: #00F5FF;
    transform: translateY(-2px);
    font-weight: bold;
  }
</style>
