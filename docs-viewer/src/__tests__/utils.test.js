import { describe, it, expect } from 'vitest';
import { fmt, paragraphIndex } from '../lib/utils.js';

describe('fmt', () => {
  it('formata segundos inteiros', () => {
    expect(fmt(0)).toBe('0:00');
    expect(fmt(60)).toBe('1:00');
    expect(fmt(65)).toBe('1:05');
    expect(fmt(3661)).toBe('61:01');
  });

  it('arredonda para baixo os decimais', () => {
    expect(fmt(65.9)).toBe('1:05');
  });

  it('retorna 0:00 para valores inválidos', () => {
    expect(fmt(null)).toBe('0:00');
    expect(fmt(undefined)).toBe('0:00');
    expect(fmt(NaN)).toBe('0:00');
    expect(fmt(0)).toBe('0:00');
  });
});

describe('paragraphIndex', () => {
  it('retorna o índice proporcional ao tempo', () => {
    expect(paragraphIndex(0, 100, 10)).toBe(0);
    expect(paragraphIndex(50, 100, 10)).toBe(5);
    expect(paragraphIndex(90, 100, 10)).toBe(9);
  });

  it('clamp no último índice quando currentTime >= duration', () => {
    expect(paragraphIndex(100, 100, 10)).toBe(9);
    expect(paragraphIndex(110, 100, 10)).toBe(9);
  });

  it('retorna -1 quando duration é zero', () => {
    expect(paragraphIndex(0, 0, 10)).toBe(-1);
  });

  it('retorna -1 quando total é zero', () => {
    expect(paragraphIndex(50, 100, 0)).toBe(-1);
  });
});
