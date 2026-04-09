import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import AudioPlayer from '../lib/AudioPlayer.svelte';

describe('AudioPlayer', () => {
  it('não renderiza nada quando audioSrc é null', () => {
    const { container } = render(AudioPlayer, { props: { audioSrc: null } });
    expect(container.querySelector('[data-testid="audio-player"]')).toBeNull();
  });

  it('renderiza o player quando audioSrc está definido', () => {
    render(AudioPlayer, { props: { audioSrc: '/audio/test.mp3', docLabel: 'test.md' } });
    expect(screen.getByTestId('audio-player')).toBeInTheDocument();
  });

  it('exibe o botão de play quando não está tocando', () => {
    render(AudioPlayer, { props: { audioSrc: '/audio/test.mp3', playing: false } });
    const btn = screen.getByRole('button', { name: /reproduzir/i });
    expect(btn).toBeInTheDocument();
    expect(btn.textContent).toBe('▶');
  });

  it('exibe o botão de pause quando está tocando', () => {
    render(AudioPlayer, { props: { audioSrc: '/audio/test.mp3', playing: true } });
    const btn = screen.getByRole('button', { name: /pausar/i });
    expect(btn.textContent).toBe('⏸');
  });

  it('exibe o tempo formatado corretamente', () => {
    render(AudioPlayer, {
      props: { audioSrc: '/audio/test.mp3', currentTime: 65, duration: 130 },
    });
    expect(screen.getByTestId('audio-time').textContent).toBe('1:05 / 2:10');
  });

  it('exibe o label do documento', () => {
    render(AudioPlayer, {
      props: { audioSrc: '/audio/test.mp3', docLabel: 'philosophy/constitution.md' },
    });
    expect(screen.getByText('philosophy/constitution.md')).toBeInTheDocument();
  });
});
