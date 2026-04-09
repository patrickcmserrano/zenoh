import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import DocsSidebar from '../lib/DocsSidebar.svelte';

const docs = ['philosophy/constitution.md', 'architecture/overview.md', 'roadmap/phases.md'];
const audioMap = { 'philosophy/constitution.md': '/audio/constitution.mp3' };

describe('DocsSidebar', () => {
  it('renderiza todos os documentos', () => {
    render(DocsSidebar, { props: { docs, selectedDoc: null, audioMap: {}, onSelect: vi.fn(), onBack: vi.fn() } });
    docs.forEach(doc => {
      expect(screen.getByTitle(doc)).toBeInTheDocument();
    });
  });

  it('marca o documento ativo com classe active', () => {
    render(DocsSidebar, {
      props: { docs, selectedDoc: 'architecture/overview.md', audioMap: {}, onSelect: vi.fn(), onBack: vi.fn() },
    });
    const active = screen.getByTitle('architecture/overview.md');
    expect(active).toHaveClass('active');
  });

  it('chama onSelect ao clicar em um documento', async () => {
    const onSelect = vi.fn();
    render(DocsSidebar, { props: { docs, selectedDoc: null, audioMap: {}, onSelect, onBack: vi.fn() } });
    await fireEvent.click(screen.getByTitle('roadmap/phases.md'));
    expect(onSelect).toHaveBeenCalledWith('roadmap/phases.md');
  });

  it('chama onBack ao clicar no header', async () => {
    const onBack = vi.fn();
    render(DocsSidebar, { props: { docs, selectedDoc: null, audioMap: {}, onSelect: vi.fn(), onBack } });
    await fireEvent.click(screen.getByRole('button', { name: /voltar/i }));
    expect(onBack).toHaveBeenCalled();
  });

  it('exibe indicador de áudio apenas para docs com áudio', () => {
    render(DocsSidebar, { props: { docs, selectedDoc: null, audioMap, onSelect: vi.fn(), onBack: vi.fn() } });
    const audioIndicators = screen.getAllByLabelText('tem áudio');
    expect(audioIndicators).toHaveLength(1);
  });
});
