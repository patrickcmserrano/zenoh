/**
 * Formata segundos em string m:ss
 * @param {number} s
 * @returns {string}
 */
export function fmt(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = String(Math.floor(s % 60)).padStart(2, '0');
  return `${m}:${sec}`;
}

/**
 * Calcula o índice do parágrafo atual com base na posição do áudio.
 * Retorna -1 se não estiver tocando ou sem dados.
 * @param {number} currentTime
 * @param {number} duration
 * @param {number} total - número de parágrafos
 * @returns {number}
 */
export function paragraphIndex(currentTime, duration, total) {
  if (!duration || total === 0) return -1;
  return Math.min(Math.floor((currentTime / duration) * total), total - 1);
}
